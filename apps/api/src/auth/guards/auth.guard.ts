import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthContext } from '../auth.types';
import { hashToken } from '../util/session.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { auth?: AuthContext }>();

    const sid = (req as any).cookies?.sid as string | undefined;
    if (!sid) throw new UnauthorizedException();

    const tokenHash = hashToken(sid);

    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      select: {
        revokedAt: true,
        expiresAt: true,
        tenantId: true,
        userId: true,
      },
    });

    if (!session) throw new UnauthorizedException();
    if (session.revokedAt) throw new UnauthorizedException();
    if (session.expiresAt.getTime() < Date.now())
      throw new UnauthorizedException();

    const member = await this.prisma.tenantMember.findUnique({
      where: {
        tenantId_userId: { tenantId: session.tenantId, userId: session.userId },
      },
      select: { role: true },
    });

    if (!member) throw new ForbiddenException('Not a member of this tenant');

    req.auth = {
      userId: session.userId,
      tenantId: session.tenantId,
      role: member.role,
    };
    return true;
  }
}
