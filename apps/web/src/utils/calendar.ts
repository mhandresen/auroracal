// calendar.ts
// Calendar-specific helpers (grid math + slot bucketing)

export function weekdayIndexMon0(date: Date) {
  // convert JS Sunday=0..Saturday=6 to Monday=0..Sunday=6
  const js = date.getUTCDay();
  return (js + 6) % 7;
}

export function bucketLabel(hour: number) {
  if (hour < 12) return "Morning";
  if (hour < 16) return "Afternoon";
  return "Evening";
}

export function formatDayLabelFromISO(isoUtc: string) {
  const d = new Date(isoUtc);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}
