import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateSlots } from '@meeting/core';
import { DateTime } from 'luxon';
import { Prisma } from '@prisma/client';
import { EmailService } from '../infra/email/email.service';
import { createBookingIcs } from '../infra/calendar/ics';
import { randomBytes } from 'crypto';
import { TenantResolver } from '../tenant/tenant-resolver';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly tenantResolver: TenantResolver,
  ) {}

  async getPublicPage(input: { tenantSlug: string; host: string }) {
    const tenant = await this.tenantResolver.resolveTenant({
      host: input.host,
      tenantSlug: input.tenantSlug,
    });
    if (!tenant) throw new NotFoundException('Tenant not found!');

    const meetingTypes = await this.prisma.meetingType.findMany({
      where: { user: { tenantId: tenant.id } },
      select: {
        slug: true,
        name: true,
        durationMinutes: true,
        locationType: true,
        locationValue: true,
        user: { select: { id: true, name: true, slug: true, timezone: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      tenant,
      meetingTypes: meetingTypes.map((mt) => ({
        ...mt,
        hostName: mt.user.name,
        hostSlug: mt.user.slug,
        timezone: mt.user.timezone,
      })),
    };
  }

  async getSlots(input: {
    tenantSlug: string;
    meetingType: string;
    from: string;
    to: string;
    host: string;
  }) {
    if (!input.meetingType)
      throw new BadRequestException('meetingType is required');
    if (!input.from || !/^\d{4}-\d{2}-\d{2}$/.test(input.from))
      throw new BadRequestException('from must be YYYY-MM-DD');
    if (!input.to || !/^\d{4}-\d{2}-\d{2}$/.test(input.to))
      throw new BadRequestException('to must be YYYY-MM-DD');

    const tenant = await this.tenantResolver.resolveTenant({
      host: input.host,
      tenantSlug: input.tenantSlug,
    });
    if (!tenant) throw new NotFoundException('Tenant not found!');

    const meetingType = await this.prisma.meetingType.findFirst({
      where: { slug: input.meetingType, user: { tenantId: tenant.id } },
      select: {
        id: true,
        slug: true,
        durationMinutes: true,
        user: { select: { id: true, timezone: true, slug: true, name: true } },
      },
    });
    if (!meetingType) throw new NotFoundException('Meeting type not found!');

    const user = meetingType.user;

    const rules = await this.prisma.availabilityRule.findMany({
      where: { userId: user.id },
      select: {
        dayOfWeek: true,
        startMinute: true,
        endMinute: true,
        enabled: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
    });

    const rangeStartUtc = new Date(`${input.from}T00:00:00.000Z`);
    const rangeEndUtc = new Date(`${input.to}T23:59:59.999Z`);

    const [blocks, bookings] = await Promise.all([
      this.prisma.availabilityBlock.findMany({
        where: {
          userId: user.id,
          startsAt: { lt: rangeEndUtc },
          endsAt: { gt: rangeStartUtc },
        },
        select: { startsAt: true, endsAt: true },
      }),
      this.prisma.booking.findMany({
        where: {
          userId: user.id,
          status: 'CONFIRMED',
          startsAt: { gte: rangeStartUtc, lte: rangeEndUtc },
        },
        select: { startsAt: true, endsAt: true },
      }),
    ]);

    const slots = generateSlots({
      from: input.from,
      to: input.to,
      timezone: user.timezone,
      durationMinutes: meetingType.durationMinutes,
      rules,
      blocks: blocks.map((b) => ({
        startsAt: b.startsAt.toISOString(),
        endsAt: b.endsAt.toISOString(),
      })),
      bookings: bookings.map((b) => ({
        startsAt: b.startsAt.toISOString(),
        endsAt: b.endsAt.toISOString(),
      })),
    });

    const now = DateTime.now();
    const bufferMinutes = 15;
    const earliestBookableTime = now.plus({ minutes: bufferMinutes });

    const futureSlots = slots.filter((s) => {
      const slotTime = DateTime.fromISO(s.startsAt);
      return slotTime >= earliestBookableTime;
    });

    return {
      timezone: user.timezone,
      meetingType: {
        slug: meetingType.slug,
        durationMinutes: meetingType.durationMinutes,
      },
      range: { from: input.from, to: input.to },
      slots: futureSlots,
    };
  }

  async bookSlot(input: {
    tenantSlug: string;
    host: string;
    meetingType: string;
    startsAt: string;
    guestName: string;
    guestEmail: string;
  }) {
    const tenant = await this.tenantResolver.resolveTenant({
      host: input.host,
      tenantSlug: input.tenantSlug,
    });
    if (!tenant) throw new NotFoundException('Tenant not found!');

    if (!input.meetingType)
      throw new BadRequestException('meetingType is required');
    if (!input.startsAt || isNaN(Date.parse(input.startsAt)))
      throw new BadRequestException('startsAt must be a valid ISO date string');
    if (!input.guestName)
      throw new BadRequestException('guestName is required');
    if (!input.guestEmail)
      throw new BadRequestException('guestEmail is required');

    const startsAtUtc = DateTime.fromISO(input.startsAt, { zone: 'utc' });
    if (!startsAtUtc.isValid)
      throw new BadRequestException('startsAt must be a valid ISO date string');

    const mt = await this.prisma.meetingType.findFirst({
      where: { slug: input.meetingType, user: { tenantId: tenant.id } },
      select: {
        id: true,
        slug: true,
        durationMinutes: true,
        user: { select: { id: true, timezone: true, slug: true, name: true } },
      },
    });
    if (!mt) throw new NotFoundException('Meeting type not found!');

    const user = mt.user;

    const endsAtUtc = startsAtUtc.plus({ minutes: mt.durationMinutes });

    const rules = await this.prisma.availabilityRule.findMany({
      where: { userId: user.id },
      select: {
        dayOfWeek: true,
        startMinute: true,
        endMinute: true,
        enabled: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
    });

    const local = startsAtUtc.setZone(user.timezone);

    const day = local.toFormat('yyyy-LL-dd');

    const dayStartUtc = DateTime.fromFormat(day, 'yyyy-LL-dd', {
      zone: user.timezone,
    })
      .startOf('day')
      .toUTC();
    const dayEndUtc = dayStartUtc.plus({ days: 1 });

    const [blocks, bookings] = await Promise.all([
      this.prisma.availabilityBlock.findMany({
        where: {
          userId: user.id,
          startsAt: { lt: dayEndUtc.toJSDate() },
          endsAt: { gt: dayStartUtc.toJSDate() },
        },
        select: { startsAt: true, endsAt: true },
      }),
      this.prisma.booking.findMany({
        where: {
          userId: user.id,
          status: 'CONFIRMED',
          startsAt: { gte: dayStartUtc.toJSDate(), lt: dayEndUtc.toJSDate() },
        },
        select: { startsAt: true, endsAt: true },
      }),
    ]);

    const slots = generateSlots({
      from: day,
      to: day,
      timezone: user.timezone,
      durationMinutes: mt.durationMinutes,
      rules,
      blocks: blocks.map((b) => ({
        startsAt: b.startsAt.toISOString(),
        endsAt: b.endsAt.toISOString(),
      })),
      bookings: bookings.map((b) => ({
        startsAt: b.startsAt.toISOString(),
        endsAt: b.endsAt.toISOString(),
      })),
    });

    const requestedIso = startsAtUtc.toUTC().toISO();
    const ok = slots.some((s) => s.startsAt === requestedIso);
    if (!ok) throw new BadRequestException('Slot is not available');

    const cancelToken = randomBytes(32).toString('hex');

    try {
      const booking = await this.prisma.booking.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          meetingTypeId: mt.id,
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          startsAt: startsAtUtc.toJSDate(),
          endsAt: endsAtUtc.toJSDate(),
          cancelToken,
        },
        select: {
          id: true,
          startsAt: true,
          endsAt: true,
          guestName: true,
          guestEmail: true,
          status: true,
        },
      });

      const startsIso = booking.startsAt.toISOString();
      const endsIso = booking.endsAt.toISOString();

      try {
        const host = await this.prisma.user.findUnique({
          where: { id: user.id },
          select: {
            email: true,
            name: true,
          },
        });

        const publicBase =
          process.env.PUBLIC_BASE_URL ?? `https://${input.host}`;
        const cancelUrl = `${publicBase}/booking/${booking.id}/cancel?token=${cancelToken}`;

        const ics = createBookingIcs({
          title: `Call with ${host?.name ?? input.tenantSlug}`,
          description: `Meeting type: ${input.meetingType}`,
          startsAtUtcIso: startsIso,
          endsAtUtcIso: endsIso,
        });

        await Promise.all([
          this.email.send({
            to: input.guestEmail,
            subject: 'Booking confirmed',
            text: `Confirmed: ${startsIso} - ${endsIso}\n\nCancel: ${cancelUrl}`,
            icsFilename: 'booking.ics',
            icsContent: ics,
          }),
          host?.email
            ? this.email.send({
                to: host.email,
                subject: 'New booking',
                text: `New booking from ${input.guestName} (${input.guestEmail}) at ${startsIso}`,
                icsFilename: 'booking.ics',
                icsContent: ics,
              })
            : Promise.resolve(),
        ]);
      } catch (mailErr) {
        console.error('Failed to send booking emails', booking.id, mailErr);
      }

      return {
        booking: {
          ...booking,
          startsAt: booking.startsAt.toISOString(),
          endsAt: booking.endsAt.toISOString(),
        },
      };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Slot already booked!');
      }
      throw e;
    }
  }

  async cancelBooking(input: { id: string; token: string }) {
    if (!input.token) throw new BadRequestException('token is required');

    const booking = await this.prisma.booking.findUnique({
      where: { id: input.id },
      select: { id: true, status: true, cancelToken: true },
    });

    if (!booking) throw new NotFoundException('Booking not found!');

    if (booking.cancelToken !== input.token) {
      throw new BadRequestException('Invalid cancel token');
    }

    if (booking.status === 'CANCELLED') {
      return { ok: true };
    }

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });

    return { ok: true };
  }

  async getPublicBooking(input: { id: string }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        status: true,
        startsAt: true,
        endsAt: true,
        guestName: true,
        guestEmail: true,
        createdAt: true,

        tenant: { select: { id: true, slug: true, name: true } },

        user: {
          select: {
            id: true,
            slug: true,
            name: true,
            timezone: true,
          },
        },

        meetingType: {
          select: {
            id: true,
            slug: true,
            name: true,
            durationMinutes: true,
            locationType: true,
            locationValue: true,
          },
        },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found!');

    return {
      booking: {
        ...booking,
        startsAt: booking.startsAt.toISOString(),
        endsAt: booking.endsAt.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      },
    };
  }
}
