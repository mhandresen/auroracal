import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentAuth } from '../auth/decorator/current-auto.decorator';
import { AuthContext } from '../auth/auth.types';
import { MeetingTypesService } from './meeting-types.service';
import { Roles } from '../auth/decorator/roles.decorator';
import { TenantRole } from '@prisma/client';
const CreateSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(50),
  durationMinutes: z.number().int().min(5).max(480).optional(),
  locationType: z.enum(['manual']).optional(),
  locationValue: z.string().max(500).optional().nullable(),
});

const UpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  slug: z.string().min(2).max(50).optional(),
  durationMinutes: z.number().int().min(5).max(480).optional(),
  locationType: z.enum(['manual']).optional(),
  locationValue: z.string().max(500).optional().nullable(),
});

@Controller('app/meeting-types')
@UseGuards(AuthGuard, RolesGuard)
export class MeetingTypesController {
  constructor(private readonly service: MeetingTypesService) {}

  @Get()
  list(@CurrentAuth() auth: AuthContext) {
    return this.service.listForUser(auth.userId);
  }

  @Post()
  @Roles(TenantRole.OWNER, TenantRole.ADMIN)
  create(@CurrentAuth() auth: AuthContext, @Body() body: unknown) {
    const dto = CreateSchema.parse(body);
    return this.service.createForUser(auth.userId, dto);
  }

  @Patch(':id')
  @Roles(TenantRole.OWNER, TenantRole.ADMIN)
  update(
    @CurrentAuth() auth: AuthContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const dto = UpdateSchema.parse(body);
    return this.service.updateForUser(auth.userId, id, dto);
  }

  @Delete(':id')
  @Roles(TenantRole.OWNER)
  remove(@CurrentAuth() auth: AuthContext, @Param('id') id: string) {
    return this.service.deleteForUser(auth.userId, id);
  }
}
