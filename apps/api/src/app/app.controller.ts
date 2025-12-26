import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentAuth } from '../auth/decorator/current-auto.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { TenantRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('app')
@Controller('app')
@UseGuards(AuthGuard, RolesGuard)
export class AppController {
  @Get('whoami')
  whoami(@CurrentAuth() auth: any) {
    return auth;
  }

  @Roles(TenantRole.ADMIN)
  @Get('admin-only')
  ping(@CurrentAuth() auth: any) {
    return { ok: true, role: auth.role };
  }
}
