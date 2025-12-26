import type { PublicSlugResponse } from "@/types/api";

type MeetingType = NonNullable<PublicSlugResponse["meetingTypes"]>[number];

type Props = {
  displayName: string;
  mt: MeetingType;
  timezone: string;
};

export function ProfilePanel({ displayName, mt, timezone }: Props) {
  return (
    <div className='rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl'>
      <div className='flex items-start gap-4'>
        <div className='relative'>
          <div className='grid h-14 w-14 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 text-lg font-semibold text-zinc-100'>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className='pointer-events-none absolute -inset-2 rounded-3xl bg-emerald-500/20 blur-xl opacity-60' />
        </div>

        <div className='flex-1'>
          <div className='text-base font-semibold tracking-tight text-zinc-50'>{displayName}</div>
          <div className='text-sm text-zinc-300'>{mt.name}</div>
        </div>
      </div>

      <div className='my-5 h-px bg-white/10' />

      <div className='space-y-2 text-sm'>
        <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2'>
          <span className='text-xs text-zinc-400'>Duration</span>
          <span className='text-xs font-medium text-zinc-200'>{mt.durationMinutes} min</span>
        </div>
        <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2'>
          <span className='text-xs text-zinc-400'>Timezone</span>
          <span className='text-xs font-medium text-zinc-200'>{timezone}</span>
        </div>
      </div>

      <div className='mt-5 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-400'>
        Tip: Select a date & time, and I&apos;ll send over a calendar invite.
      </div>
    </div>
  );
}
