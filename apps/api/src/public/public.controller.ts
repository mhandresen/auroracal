import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { PublicService } from './public.service';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly service: PublicService) {}

  @Get('/:tenantSlug')
  @ApiParam({ name: 'tenantSlug', example: 'martin' })
  getPublicPage(@Param('tenantSlug') tenantSlug: string, @Req() req: Request) {
    return this.service.getPublicPage({
      tenantSlug,
      host: req.headers.host ?? '',
    });
  }

  @Get('/:tenantSlug/slots')
  getSlots(
    @Param('tenantSlug') tenantSlug: string,
    @Query('meetingType') meetingType: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Req() req: Request,
  ) {
    return this.service.getSlots({
      tenantSlug,
      meetingType,
      from,
      to,
      host: req.headers.host ?? '',
    });
  }

  @Get('/booking/:id')
  getPublicBooking(@Param('id') id: string) {
    return this.service.getPublicBooking({ id });
  }

  @Post('/:tenantSlug/book')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        meetingType: { type: 'string', example: '30min' },
        startsAt: { type: 'string', example: '2025-12-22T08:00:00.000Z' },
        guestName: { type: 'string', example: 'Ola Nordmann' },
        guestEmail: { type: 'string', example: 'ola@example.com' },
      },
      required: ['meetingType', 'startsAt', 'guestName', 'guestEmail'],
    },
  })
  book(
    @Param('tenantSlug') tenantSlug: string,
    @Body()
    body: {
      meetingType: string;
      startsAt: string;
      guestName: string;
      guestEmail: string;
    },
    @Req() req: Request,
  ) {
    return this.service.bookSlot({
      tenantSlug,
      host: req.headers.host ?? '',
      ...body,
    });
  }

  @Post('/booking/:id/cancel')
  cancelBooking(@Param('id') id: string, @Query('token') token: string) {
    return this.service.cancelBooking({ id, token });
  }
}
