import { DateTime } from 'luxon';

export type AvailabilityRuleDTO = {
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  enabled: boolean;
}

export type AvailabilityBlockDTO = {
  startsAt: string | Date;
  endsAt: string | Date;
}

export type BookingDTO = {
  startsAt: string | Date;
  endsAt: string | Date;
}

export type GenerateSlotsInput = {
  from: string;
  to: string;
  timezone: string;
  durationMinutes: number;
  rules: AvailabilityRuleDTO[];
  blocks?: AvailabilityBlockDTO[];
  bookings?: BookingDTO[];
}

export type Slot = { startsAt: string; endsAt: string };

function overlaps(aStart: DateTime, aEnd: DateTime, bStart: DateTime, bEnd: DateTime) {
  return aStart < bEnd && bStart < aEnd;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

export function generateSlots(input: GenerateSlotsInput): Slot[] {
  const { from, to, timezone, durationMinutes, rules, blocks = [], bookings = [] } = input;
  
  const fromDt = DateTime.fromISO(from, { zone: timezone }).startOf('day');
  const toDt = DateTime.fromISO(to, { zone: timezone }).startOf('day');

  if (!fromDt.isValid || !toDt.isValid) return [];
  if (toDt < fromDt) return [];

  const enabledRules = rules.filter((r) => r.enabled);

  const blockRanges = blocks.map((b) => {
    const start = DateTime.fromISO(toIso(b.startsAt), { zone: "utc" });
    const end = DateTime.fromISO(toIso(b.endsAt), { zone: "utc" });
    return { start, end };
  }).filter((r) => r.start.isValid && r.end.isValid)

  const bookingRanges = bookings.map((b) => {
    const start = DateTime.fromISO(toIso(b.startsAt), { zone: "utc" });
    const end = DateTime.fromISO(toIso(b.endsAt), { zone: "utc" });
    return { start, end };
  }).filter((r) => r.start.isValid && r.end.isValid)

  const slots: Slot[] = [];

  for (let day = fromDt; day <= toDt; day = day.plus({ days: 1 })) {
    const dayOfWeek0 = day.weekday % 7;

    const dayRules = enabledRules.filter((r) => r.dayOfWeek === dayOfWeek0);
    if (dayRules.length === 0) continue;

    for (const rule of dayRules) {
      let cursor = day.plus({ minutes: rule.startMinute });

      const ruleEnd = day.plus({ minutes: rule.endMinute });
      while (cursor.plus({ minutes: durationMinutes }) <= ruleEnd) {
        const startLocal = cursor;
        const endLocal = cursor.plus({ minutes: durationMinutes });

        const startUtc = startLocal.toUTC();
        const endUtc = endLocal.toUTC();

        const blocked = blockRanges.some((br) => overlaps(startUtc, endUtc, br.start, br.end)) || bookingRanges.some((br) => overlaps(startUtc, endUtc, br.start, br.end))

        if (!blocked) {
          slots.push({ startsAt: startUtc.toISO()!, endsAt: endUtc.toISO()! })
        }

        cursor = cursor.plus({minutes: durationMinutes})
      }
    }
  }

  slots.sort((a, b) => (a.startsAt < b.startsAt ? -1 : a.startsAt > b.startsAt ? 1 : 0));
  return slots;
}