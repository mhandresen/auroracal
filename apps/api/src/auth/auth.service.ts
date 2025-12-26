import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { hashToken, newSessionToken } from './util/session.util';
import { DateTime } from 'luxon';
import { Prisma, TenantRole } from '@prisma/client';
import { ensureUniqueSlug } from './util/slug.util';
import { defaultTenantName, deriveBaseSlug } from './util/slug-derive.util';

type LoginInput = { email: string; password: string };

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(input: LoginInput) {
    const user = await this.prisma.user.findFirst({
      where: { email: input.email.toLowerCase() },
      select: {
        id: true,
        tenantId: true,
        email: true,
        name: true,
        slug: true,
        passwordHash: true,
      },
    });

    if (!user?.passwordHash) return null;

    const ok = await argon2.verify(user.passwordHash, input.password);
    if (!ok) return null;

    const sessionToken = newSessionToken();
    const tokenHash = hashToken(sessionToken);

    const expiresAt = DateTime.utc().plus({ days: 30 }).toJSDate();

    await this.prisma.session.create({
      data: {
        userId: user.id,
        tenantId: user.tenantId,
        tokenHash,
        expiresAt,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const safeUser = {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      slug: user.slug,
    };

    return { user: safeUser, sessionToken };
  }

  async register(input: {
    name?: string;
    email: string;
    password: string;
    timezone?: string;
  }) {
    const email = input.email.toLowerCase();
    const passwordHash = await argon2.hash(input.password);

    const sessionToken = newSessionToken();
    const tokenHash = hashToken(sessionToken);
    const expiresAt = DateTime.utc().plus({ days: 30 }).toJSDate();

    const result = await this.prisma.$transaction(async (tx) => {
      const baseTenantSlug = deriveBaseSlug({
        name: input.name,
        email: input.email,
      });

      let tenant: { id: string; slug: string; name: string } | null = null;

      for (let attempt = 0; attempt < 5; attempt++) {
        const tenantSlug = await ensureUniqueSlug(
          baseTenantSlug,
          async (slug) => {
            const existing = await tx.tenant.findUnique({
              where: { slug },
              select: { id: true },
            });
            return !!existing;
          },
        );

        try {
          tenant = await tx.tenant.create({
            data: {
              slug: tenantSlug,
              name: defaultTenantName(input.name, email),
            },
            select: { id: true, slug: true, name: true },
          });
          break;
        } catch (e) {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === 'P2002'
          )
            continue;
          throw e;
        }
      }

      if (!tenant) throw new Error('Failed to create tenant (slug collisions');

      const baseUserSlug = deriveBaseSlug({
        name: input.name,
        email: input.email,
      });
      const userSlug = await ensureUniqueSlug(baseUserSlug, async (slug) => {
        const existing = await tx.user.findUnique({
          where: { tenantId_slug: { tenantId: tenant!.id, slug } },
          select: { id: true },
        });
        return !!existing;
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email,
          name: input.name,
          slug: userSlug,
          timezone: input.timezone ?? 'UTC',
          passwordHash,
        },
        select: {
          id: true,
          tenantId: true,
          email: true,
          name: true,
          slug: true,
          timezone: true,
        },
      });

      await tx.tenantMember.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: TenantRole.OWNER,
        },
      });

      await tx.availabilityRule.createMany({
        data: [1, 2, 3, 4, 5].map((dow) => ({
          userId: user.id,
          dayOfWeek: dow,
          startMinute: 9 * 60,
          endMinute: 17 * 60,
          enabled: true,
        })),
      });

      await tx.session.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      return { tenant, user };
    });

    return { ...result, sessionToken };
  }

  async me(sessionToken: string | undefined) {
    if (!sessionToken) return null;

    const tokenHash = hashToken(sessionToken);

    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      select: {
        revokedAt: true,
        expiresAt: true,
        tenantId: true,
        user: {
          select: {
            id: true,
            tenantId: true,
            email: true,
            name: true,
            slug: true,
            timezone: true,
          },
        },
      },
    });

    if (!session) return null;
    if (session.revokedAt) return null;
    if (session.expiresAt.getTime() <= Date.now()) return null;

    const member = await this.prisma.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId: session.tenantId,
          userId: session.user.id,
        },
      },
      select: { role: true },
    });

    return {
      user: session.user,
      tenantId: session.tenantId,
      role: member?.role ?? null,
    };
  }

  async logout(sessionToken: string | undefined) {
    if (!sessionToken) return;

    const tokenHash = hashToken(sessionToken);

    await this.prisma.session.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }
}
