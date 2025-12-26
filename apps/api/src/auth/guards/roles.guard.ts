import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { AuthContext } from '../auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<TenantRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;
    const req = context.switchToHttp().getRequest<{ auth: AuthContext }>();
    const userRole = req.auth?.role;

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
