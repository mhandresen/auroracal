import { parseYmdToUTCDate } from "@/utils/date";
import type { CalCell } from "@/hooks/use-meeting-type-booking";

type Props2 = {
  title: string;
  cells: CalCell[];
  selectedDay: string;
  isSelectableDay: (ymd: string) => boolean;
  inRange: (ymd: string) => boolean;
  onSelectDay: (ymd: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarPanel({
  title,
  cells,
  selectedDay,
  isSelectableDay,
  inRange,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}: Props2) {
  return (
    <div className='rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='text-base font-semibold text-zinc-50'>{title}</div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={onPrevMonth}
            className='grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-black/20 text-zinc-200 hover:bg-white/10'
          >
            ←
          </button>
          <button
            type='button'
            onClick={onNextMonth}
            className='grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-black/20 text-zinc-200 hover:bg-white/10'
          >
            →
          </button>
        </div>
      </div>

      <div className='mb-2 grid grid-cols-7 gap-2 text-center text-xs text-zinc-500'>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className='font-medium'>
            {d}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-2'>
        {cells.map((cell, idx) => {
          if (!cell.ymd) return <div key={idx} className='h-10' />;

          const dayNum = parseYmdToUTCDate(cell.ymd).getUTCDate();
          const selectable = isSelectableDay(cell.ymd);
          const inSelectableRange = inRange(cell.ymd);
          const active = cell.ymd === selectedDay;

          return (
            <button
              key={cell.ymd}
              type='button'
              disabled={!selectable}
              onClick={() => onSelectDay(cell.ymd!)}
              className={[
                "grid h-10 place-items-center rounded-2xl border text-sm font-medium transition",
                active
                  ? "border-emerald-400/30 bg-emerald-500/15 text-zinc-50 ring-1 ring-emerald-400/30"
                  : selectable
                    ? "border-white/10 bg-black/20 text-zinc-200 hover:bg-white/10"
                    : inSelectableRange
                      ? "border-transparent text-zinc-600 cursor-not-allowed"
                      : "border-transparent text-zinc-700 cursor-not-allowed",
              ].join(" ")}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
