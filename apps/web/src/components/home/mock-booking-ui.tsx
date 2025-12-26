import { Badge } from "../ui/badge";
import { Button } from "../custom/button";
import { Row } from "../ui/row";
import cx from "classnames";

export function MockBookingUI() {
  return (
    <div className='relative overflow-hidden rounded-[22px] border border-white/10 bg-black/40'>
      <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
        <div className='flex items-center gap-2'>
          <div className='grid h-8 w-8 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10'>
            <span className='text-xs font-semibold text-zinc-200'>M</span>
          </div>
          <div>
            <div className='text-sm font-semibold text-zinc-50'>Martin (example)</div>
            <div className='text-xs text-zinc-400'>30 min call • Europe/Oslo</div>
          </div>
        </div>
        <div className='hidden items-center gap-2 sm:flex'>
          <Badge>30 min</Badge>
          <Badge>Video</Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 p-4 lg:grid-cols-3'>
        <div className='rounded-3xl border border-white/10 bg-white/5 p-4'>
          <div className='text-sm font-semibold text-zinc-50'>Details</div>
          <div className='mt-3 space-y-2'>
            <Row label='Length' value='30 min' />
            <Row label='Timezone' value='Auto' />
            <Row label='Invite' value='.ics' />
          </div>
          <div className='mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-400'>
            Select a date & time — you’ll receive a calendar invite instantly.
          </div>
        </div>

        <div className='rounded-3xl border border-white/10 bg-white/5 p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-semibold text-zinc-50'>December</div>
            <div className='flex items-center gap-2'>
              <button className='h-8 w-8 rounded-2xl border border-white/10 bg-black/20 text-zinc-200 hover:bg-white/10'>
                ←
              </button>
              <button className='h-8 w-8 rounded-2xl border border-white/10 bg-black/20 text-zinc-200 hover:bg-white/10'>
                →
              </button>
            </div>
          </div>
          <div className='mt-4 grid grid-cols-7 gap-2 text-center text-xs text-zinc-500'>
            {"SMTWTFS".split("").map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className='mt-2 grid grid-cols-7 gap-2'>
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1;
              const selected = day === 22;
              const active = [22, 23, 24, 25, 26, 29, 30, 31].includes(day);
              return (
                <div
                  key={day}
                  className={cx(
                    "grid h-9 place-items-center rounded-2xl border text-xs transition",
                    active
                      ? "border-white/10 bg-black/20 text-zinc-200 hover:bg-white/10"
                      : "border-transparent text-zinc-700",
                    selected && "ring-1 ring-emerald-400/40 bg-emerald-500/10"
                  )}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        <div className='rounded-3xl border border-white/10 bg-white/5 p-4'>
          <div className='text-sm font-semibold text-zinc-50'>Monday 22</div>
          <div className='mt-1 text-xs text-zinc-400'>Times in your local time</div>

          <div className='mt-4 text-xs font-semibold text-zinc-300'>Morning</div>
          <div className='mt-2 grid grid-cols-3 gap-2'>
            {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"].map((t) => (
              <button
                key={t}
                className={cx(
                  "rounded-2xl border border-white/10 bg-black/20 px-2 py-2 text-xs text-zinc-200 transition hover:bg-white/10",
                  t === "10:30" && "ring-1 ring-emerald-400/40 bg-emerald-500/10"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className='mt-4 text-xs font-semibold text-zinc-300'>Afternoon</div>
          <div className='mt-2 grid grid-cols-3 gap-2'>
            {["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"].map((t) => (
              <button
                key={t}
                className='rounded-2xl border border-white/10 bg-black/20 px-2 py-2 text-xs text-zinc-200 transition hover:bg-white/10'
              >
                {t}
              </button>
            ))}
          </div>

          <Button className='mt-4 w-full rounded-2xl'>Confirm</Button>
        </div>
      </div>

      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl' />
        <div className='absolute -right-10 top-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl' />
        <div className='absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl' />
      </div>
    </div>
  );
}
