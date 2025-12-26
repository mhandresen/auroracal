import * as React from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

import { ProfilePanel } from "@/routes/$tenantSlug/$meetingType/components/profile-panel";
import { CalendarPanel } from "@/routes/$tenantSlug/$meetingType/components/calendar-panel";
import { TimeSlotsPanel } from "@/routes/$tenantSlug/$meetingType/components/timeslots-panel";
import { GlassCard2 } from "@/components/ui/glass-card";

import type { CalCell } from "@/hooks/use-meeting-type-booking";
import type { Slot } from "@/types/api";

function buildMockCurrentMonthCells(): CalCell[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // First day of current month
  const firstDay = new Date(year, month, 1);
  const offset = firstDay.getDay(); // 0 (Sun) to 6 (Sat)

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Previous month info
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  const cells: CalCell[] = [];

  // Previous month cells
  for (let i = 0; i < offset; i++) {
    const day = daysInPrevMonth - offset + i + 1;
    cells.push({
      ymd: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      inMonth: false,
    });
  }

  // Current month cells
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      ymd: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      inMonth: true,
    });
  }

  // Next month cells to reach 42
  const remaining = 42 - cells.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let day = 1; day <= remaining; day++) {
    cells.push({
      ymd: `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      inMonth: false,
    });
  }

  return cells;
}

function buildMockSlotsForDay(ymd: string): ReadonlyArray<readonly [string, Slot[]]> {
  // Using UTC "Z" is fine for a mock.
  const mk = (hhmm: string) => ({
    startsAt: `${ymd}T${hhmm}:00.000Z`,
  });

  return [
    ["Morning", [mk("09:00"), mk("09:30"), mk("10:00"), mk("10:30"), mk("11:00"), mk("11:30")]],
    ["Afternoon", [mk("12:00"), mk("12:30"), mk("13:00"), mk("13:30"), mk("14:00"), mk("14:30")]],
  ] as const;
}

export function DemoShowcase({ children }: { children?: React.ReactNode }) {
  return (
    <div className='relative'>
      <div className='absolute -inset-6 rounded-[40px] bg-gradient-to-r from-emerald-500/10 via-cyan-400/10 to-violet-500/10 blur-2xl' />
      <div className='relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/45 backdrop-blur-xl'>
        <div className='flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4'>
          <div className='flex items-center gap-3'>
            <div className='grid h-9 w-9 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10'>
              <Sparkles className='h-4 w-4 text-emerald-300' />
            </div>
            <div>
              <div className='text-sm font-semibold text-zinc-50'>Booking page preview</div>
              <div className='text-xs text-zinc-400'>Crisp, accessible, and conversion-optimized</div>
            </div>
          </div>
          <div className='hidden items-center gap-2 sm:flex'>
            <Badge>Keyboard-friendly</Badge>
            <Badge>Mobile-first</Badge>
            <Badge>Fast</Badge>
          </div>
        </div>

        <div className='p-5'>
          {children ? (
            <GlassCard2>
              <div className='grid grid-cols-[1fr_2fr_1fr] gap-4 md:gap-6 md:grid-cols-[280px_1fr_280px] lg:grid-cols-[320px_1fr_320px]'>
                {children}
              </div>
            </GlassCard2>
          ) : (
            <RealBookingPreviewMock />
          )}
        </div>
      </div>
    </div>
  );
}

function RealBookingPreviewMock() {
  const displayName = "Martin (example)";
  const timezone = "Europe/Oslo";

  const mt = {
    name: "30 min call",
    durationMinutes: 30,
  } as any;

  const today = new Date();
  const title = today.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const cells = React.useMemo(() => buildMockCurrentMonthCells(), []);
  const selectedDay = React.useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const groupedSlots = React.useMemo(() => buildMockSlotsForDay(selectedDay), [selectedDay]);
  const [selectedStartsAt, setSelectedStartsAt] = React.useState<string | null>(`${selectedDay}T10:30:00.000Z`);
  const selectableDays = React.useMemo(() => {
    const days = new Set<string>();
    const now = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);

      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        days.add(ymd);
      }
    }

    return days;
  }, []);

  return (
    <GlassCard2>
      {/* Prevent navigation for the mock confirm Link while keeping the real look */}
      <div
        onClickCapture={(e) => {
          const target = e.target as HTMLElement | null;
          const isConfirmLink = !!target?.closest('a[href], a[role="link"]');
          if (isConfirmLink) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className='grid grid-cols-[1fr_2fr_1fr] gap-4 md:gap-6 md:grid-cols-[280px_1fr_280px] lg:grid-cols-[320px_1fr_320px]'
      >
        <ProfilePanel displayName={displayName} mt={mt} timezone={timezone} />

        <CalendarPanel
          title={title}
          cells={cells}
          selectedDay={selectedDay}
          isSelectableDay={(ymd) => selectableDays.has(ymd)}
          inRange={(ymd) => {
            const date = new Date(ymd);
            const now = new Date();
            return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
          }}
          onSelectDay={() => {}}
          onPrevMonth={() => {}}
          onNextMonth={() => {}}
        />

        <TimeSlotsPanel
          selectedDay={selectedDay}
          groupedSlots={groupedSlots}
          isLoading={false}
          isError={false}
          hasNone={false}
          selectedStartsAt={selectedStartsAt}
          onSelectStartsAt={setSelectedStartsAt}
          confirmHref={null}
        />
      </div>
    </GlassCard2>
  );
}
