import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthContext } from '../auth/auth.types';
import { ensureUniqueMeetingTypeSlug } from './utils/slug.util';
import { NotFoundError } from 'rxjs';

export type CreateMeetingTypeInput = {
  name: string;
  slug: string;
  durationMinutes?: number;
  locationType?: 'manual';
  locationValue?: string | null;
};

export type UpdateMeetingTypeInput = Partial<CreateMeetingTypeInput>;

@Injectable()
export class MeetingTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.meetingType.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createForUser(userId: string, input: CreateMeetingTypeInput) {
    const slug = await ensureUniqueMeetingTypeSlug({
      desired: input.slug,
      userId,
      isTaken: async (slug) => {
        const existing = await this.prisma.meetingType.findUnique({
          where: { userId_slug: { userId, slug } },
          select: { id: true },
        });
        return !!existing;
      },
    });

    return this.prisma.meetingType.create({
      data: {
        userId,
        name: input.name,
        slug,
        durationMinutes: input.durationMinutes ?? 30,
        locationType: input.locationType ?? 'manual',
        locationValue: input.locationValue ?? null,
      },
    });
  }

  async updateForUser(
    userId: string,
    meetingTypeId: string,
    input: UpdateMeetingTypeInput,
  ) {
    const existing = await this.prisma.meetingType.findFirst({
      where: { id: meetingTypeId, userId },
      select: { id: true, slug: true },
    });
    if (!existing) throw new Error('MeetingType not found');

    let slug: string | undefined;
    if (input.slug) {
      slug = await ensureUniqueMeetingTypeSlug({
        desired: input.slug,
        userId,
        isTaken: async (slug) => {
          const found = await this.prisma.meetingType.findUnique({
            where: { userId_slug: { userId, slug } },
            select: { id: true },
          });
          return !!found && found.id !== meetingTypeId;
        },
      });
    }

    return this.prisma.meetingType.update({
      where: { id: meetingTypeId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(input.durationMinutes !== undefined
          ? { durationMinutes: input.durationMinutes }
          : {}),
        ...(input.locationType !== undefined
          ? { locationType: input.locationType }
          : {}),
        ...(input.locationValue !== undefined
          ? { locationValue: input.locationValue }
          : {}),
      },
    });
  }

  async deleteForUser(userId: string, meetingTypeId: string) {
    const existing = await this.prisma.meetingType.findFirst({
      where: { id: meetingTypeId, userId },
      select: { id: true },
    });

    if (!existing) throw new NotFoundError('MeetingType not found');

    const futureBookings = await this.prisma.booking.count({
      where: {
        meetingTypeId,
        startsAt: { gt: new Date() },
        status: 'CONFIRMED',
      },
    });
    if (futureBookings > 0)
      throw new BadRequestException('Has future bookings');

    return this.prisma.meetingType.delete({ where: { id: meetingTypeId } });
  }
}
