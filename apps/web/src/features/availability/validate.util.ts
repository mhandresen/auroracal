import type { DayKey, WeeklyAvailability } from "./availability.api";

export function validateWeekly(model: WeeklyAvailability): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  for (const dayKey of Object.keys(model.days) as DayKey[]) {
    const day = model.days[dayKey];
    if (!day.enabled) continue;

    if (day.ranges.length === 0) {
      errors.push(`Add at least one time range for ${dayKey.toUpperCase()} or disabled the day.`);
      continue;
    }

    const ranges = day.ranges
      .map((r) => ({ ...r, s: toMinutes(r.start), e: toMinutes(r.end) }))
      .sort((a, b) => a.s - b.s);

    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      if (Number.isNaN(r.s) || Number.isNaN(r.e)) errors.push(`Invalid time value on ${dayKey.toUpperCase()}`);
      if (r.s >= r.e) errors.push(`On ${dayKey.toUpperCase()}, start time must be before end time.`);
      if (i > 0) {
        const prev = ranges[i - 1];
        if (r.s < prev.e) errors.push(`On ${dayKey.toUpperCase()}, time ranges cannot overlap.`);
      }
    }
  }
  return errors.length ? { ok: false, errors } : { ok: true };
}

function toMinutes(time: string) {
  const [hh, mm] = time.split(":").map((x) => Number(x));
  return hh * 60 + mm;
}
