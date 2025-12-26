import type { Slot } from "@/types/api";
import type { CalCell } from "@/hooks/use-meeting-type-booking";

/* ---------------- helpers ---------------- */

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

function makeMonthCells(year: number, month: number): CalCell[] {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const firstDow = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: CalCell[] = [];

  // leading padding (previous month)
  for (let i = 0; i < firstDow; i++) {
    cells.push({ ymd: null, inMonth: false });
  }

  // actual month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      ymd: ymd(year, month, d),
      inMonth: true,
    });
  }

  // trailing padding (next month)
  while (cells.length % 7 !== 0) {
    cells.push({ ymd: null, inMonth: false });
  }

  return cells;
}

function makeSlots(day: string, times: string[]): Slot[] {
  return times.map((t) => ({
    startsAt: `${day}T${t}:00.000Z`,
  })) as Slot[];
}

/* ---------------- mock booking ---------------- */

export function createMockBooking() {
  const year = 2025;
  const month = 12;

  const selectableDays = new Set<string>([
    ymd(year, month, 22),
    ymd(year, month, 23),
    ymd(year, month, 24),
    ymd(year, month, 25),
    ymd(year, month, 26),
    ymd(year, month, 29),
    ymd(year, month, 30),
    ymd(year, month, 31),
  ]);

  const selectedDay = ymd(year, month, 22);

  const slots = makeSlots(selectedDay, [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
  ]);

  const groupedSlots = [
    ["Morning", slots.slice(0, 6)],
    ["Afternoon", slots.slice(6)],
  ] as const;

  return {
    /* ProfilePanel */
    displayName: "Martin (example)",
    mt: {
      name: "30 min call",
      durationMinutes: 30,
      slug: "30min",
      locationType: "manual",
      locationValue: "Google Meet",
      hostName: "Martin (example)",
      hostSlug: "martin-example",
      timezone: "Europe/Oslo",
    },
    timezone: "Europe/Oslo",

    /* CalendarPanel */
    cal: {
      title: "December 2025",
      cells: makeMonthCells(year, month),
    },
    selectedDay,
    isSelectableDay: (d: string) => selectableDays.has(d),
    inRange: (d: string) => d.startsWith(`${year}-${pad(month)}`),

    /* TimeSlotsPanel */
    groupedSlots,
    slotsForSelectedDay: slots,
    selectedStartsAt: slots[3].startsAt,
  };
}
