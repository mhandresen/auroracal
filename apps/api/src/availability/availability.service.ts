import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
const dayKeyToDow = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const dowToDayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

function toMinute(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getWeekly(userId: string) {
    const rules = await this.prisma.availabilityRule.findMany({
      where: { userId },
      orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
    });

    const empty = () => ({
      enabled: false,
      ranges: [] as { start: string; end: string }[],
    });

    const days: any = {
      sun: empty(),
      mon: empty(),
      tue: empty(),
      wed: empty(),
      thu: empty(),
      fri: empty(),
      sat: empty(),
    };

    for (const rule of rules) {
      const key = dowToDayKey[rule.dayOfWeek] ?? 'sun';
      days[key].enabled = days[key].enabled || rule.enabled;

      const sH = String(Math.floor(rule.startMinute / 60)).padStart(2, '0');
      const sM = String(rule.startMinute % 60).padStart(2, '0');
      const eH = String(Math.floor(rule.endMinute / 60)).padStart(2, '0');
      const eM = String(rule.endMinute % 60).padStart(2, '0');
      days[key].ranges.push({ start: `${sH}:${sM}`, end: `${eH}:${eM}` });
    }

    return { days };
  }

  async replaceWeekly(
    userId: string,
    input: {
      days: Record<
        string,
        { enabled: boolean; ranges: { start: string; end: string }[] }
      >;
    },
  ) {
    for (const [dayKey, day] of Object.entries(input.days)) {
      if (!day.enabled) continue;

      const ranges = day.ranges
        .map((r) => ({ s: toMinute(r.start), e: toMinute(r.end) }))
        .sort((a, b) => a.s - b.s);

      for (let i = 0; i < ranges.length; i++) {
        if (ranges[i].s >= ranges[i].e)
          throw new Error(`Invalid range on ${dayKey}`);
        if (i > 0 && ranges[i].s < ranges[i - 1].e)
          throw new Error(`Overlapping ranges on ${dayKey}`);
      }
    }

    const rows = Object.entries(input.days).flatMap(([dayKey, day]) => {
      const dow = (dayKeyToDow as any)[dayKey];
      if (dow === undefined) return [];
      if (!day.enabled) return [];
      return day.ranges.map((r) => ({
        userId,
        dayOfWeek: dow,
        startMinute: toMinute(r.start),
        endMinute: toMinute(r.end),
        enabled: true,
      }));
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.availabilityRule.deleteMany({ where: { userId } });
      if (rows.length) await tx.availabilityRule.createMany({ data: rows });
    });

    return this.getWeekly(userId);
  }
}
