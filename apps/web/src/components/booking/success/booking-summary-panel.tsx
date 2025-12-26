type Props = {
  hostName: string;
  meetingName: string;
  durationMinutes: number;
  hostTz: string;
  startsAt: string;
  endsAt: string;
  cancelled?: boolean;
  formatDayLabelFromISO: (isoUtc: string) => string;
  formatTimeLocal: (isoUtc: string) => string;
};

export function BookingSummaryPanel({
  hostName,
  meetingName,
  durationMinutes,
  hostTz,
  startsAt,
  endsAt,
  cancelled = false,
  formatDayLabelFromISO,
  formatTimeLocal,
}: Props) {
  return (
    <div className='rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl'>
      <div className='flex items-start gap-4'>
        <div className='relative'>
          <div className='grid h-14 w-14 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 text-lg font-semibold text-zinc-100'>
            {hostName.charAt(0).toUpperCase()}
          </div>
          <div className='pointer-events-none absolute -inset-2 rounded-3xl bg-emerald-500/20 blur-xl opacity-60' />
        </div>

        <div className='flex-1'>
          <div className='text-base font-semibold tracking-tight text-zinc-50'>{hostName}</div>
          <div className='text-sm text-zinc-300'>{meetingName}</div>
        </div>
      </div>

      <div className='my-5 h-px bg-white/10' />

      <div className='space-y-2 text-sm'>
        <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2'>
          <span className='text-xs text-zinc-400'>Duration</span>
          <span className='text-xs font-medium text-zinc-200'>{durationMinutes} min</span>
        </div>

        <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2'>
          <span className='text-xs text-zinc-400'>Timezone</span>
          <span className='text-xs font-medium text-zinc-200'>{hostTz}</span>
        </div>
      </div>

      <div className='my-5 h-px bg-white/10' />

      <div className='rounded-2xl border border-white/10 bg-black/20 p-3'>
        <div className='text-[11px] font-medium tracking-wide text-zinc-400'>
          {cancelled ? "Was scheduled for" : "When"}
        </div>
        <div className='mt-2'>
          <div className='text-sm font-medium text-zinc-100'>{formatDayLabelFromISO(startsAt)}</div>
          <div className='mt-0.5 text-xs text-zinc-300'>
            {formatTimeLocal(startsAt)} – {formatTimeLocal(endsAt)}{" "}
            <span className='text-zinc-400'>(your local time)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
