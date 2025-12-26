// date.ts
export function addDaysUTC(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function ymdUTC(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseYmdToUTCDate(ymd: string) {
  // ymd is YYYY-MM-DD; interpret as UTC midnight
  return new Date(`${ymd}T00:00:00.000Z`);
}

export function startOfMonthUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function endOfMonthUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

export function addMonthsUTC(date: Date, delta: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1));
}

export function formatMonthTitle(date: Date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function formatDayLabel(ymd: string) {
  const d = parseYmdToUTCDate(ymd);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export function formatTimeLocal(isoUtc: string) {
  const d = new Date(isoUtc);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
