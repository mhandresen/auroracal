import { Link } from "@tanstack/react-router";
import type { Slot } from "@/types/api";
import { formatDayLabel, formatTimeLocal } from "@/utils/date";

type ConfirmHref = {
  to: "/$tenantSlug/$meetingType/book";
  params: { tenantSlug: string; meetingType: string };
  search: { startsAt: string };
} | null;

type Props3 = {
  selectedDay: string;
  groupedSlots: ReadonlyArray<readonly [string, Slot[]]>;
  isLoading: boolean;
  isError: boolean;
  hasNone: boolean;
  selectedStartsAt: string | null;
  onSelectStartsAt: (startsAt: string) => void;
  confirmHref: ConfirmHref;
};

export function TimeSlotsPanel({
  selectedDay,
  groupedSlots,
  isLoading,
  isError,
  hasNone,
  selectedStartsAt,
  onSelectStartsAt,
  confirmHref,
}: Props3) {
  return (
    <div className='flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl'>
      <div className='mb-4'>
        <div className='text-base font-semibold text-zinc-50'>{formatDayLabel(selectedDay).split(",")[0]}</div>
        <div className='text-sm text-zinc-400'>Times in your local time</div>
      </div>

      <div className='flex-1 overflow-auto space-y-6'>
        {isLoading ? (
          <div className='animate-pulse space-y-3'>
            <div className='h-4 w-24 rounded bg-white/10' />
            <div className='h-10 rounded-2xl bg-white/10' />
            <div className='h-10 rounded-2xl bg-white/10' />
          </div>
        ) : isError ? (
          <div className='text-sm text-zinc-300'>Could not load slots.</div>
        ) : hasNone ? (
          <div className='text-sm text-zinc-300'>No times available on this day.</div>
        ) : (
          <>
            {groupedSlots.map(([label, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={label}>
                  <div className='mb-3 text-sm font-semibold text-zinc-200'>{label}</div>
                  <div className='grid grid-cols-3 gap-2'>
                    {items.map((s) => {
                      const active = selectedStartsAt === s.startsAt;
                      return (
                        <button
                          key={s.startsAt}
                          type='button'
                          onClick={() => onSelectStartsAt(s.startsAt)}
                          className={[
                            "rounded-2xl border px-3 py-2 text-sm font-medium transition",
                            active
                              ? "border-emerald-400/30 bg-emerald-500/15 text-zinc-50 ring-1 ring-emerald-400/30"
                              : "border-white/10 bg-black/20 text-zinc-200 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {formatTimeLocal(s.startsAt)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className='mt-6'>
        {confirmHref ? (
          <Link
            to={confirmHref.to}
            params={confirmHref.params}
            search={confirmHref.search}
            className='block w-full rounded-2xl bg-emerald-500/90 px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-400 shadow-[0_18px_60px_-30px_rgba(16,185,129,0.8)]'
          >
            Confirm
          </Link>
        ) : (
          <button
            type='button'
            disabled
            className='w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-500'
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
}
