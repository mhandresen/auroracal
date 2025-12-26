// availability.controller.ts
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { z } from 'zod';
import { CurrentAuth } from '../auth/decorator/current-auto.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthContext } from '../auth/auth.types';

class TimeRangeDto {
  start!: string;
  end!: string;
}

class DayAvailabilityDto {
  enabled!: boolean;
  ranges!: TimeRangeDto[];
}

class WeeklyAvailabilityDto {
  days!: {
    [key: string]: DayAvailabilityDto;
  };
}

const timeRangeSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});
const weeklySchema = z.object({
  days: z.record(
    z.enum(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']),
    z.object({
      enabled: z.boolean(),
      ranges: z.array(timeRangeSchema),
    }),
  ),
});

@ApiTags('Availability')
@Controller('/app/availability')
@UseGuards(AuthGuard, RolesGuard)
export class AvailabilityController {
  constructor(private readonly svc: AvailabilityService) {}

  @Get('/weekly')
  async getWeekly(@CurrentAuth() auth: AuthContext) {
    return this.svc.getWeekly(auth.userId);
  }

  @Put('/weekly')
  async putWeekly(
    @CurrentAuth() auth: AuthContext,
    @Body() body: WeeklyAvailabilityDto,
  ) {
    const input = weeklySchema.parse(body);
    return this.svc.replaceWeekly(auth.userId, input);
  }
}
