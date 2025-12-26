import { Link } from "@tanstack/react-router";

type Props = {
  tenantSlug: string;
  meetingType: string;
  cancelled: boolean;
};

export function BookingActionsPanel({ tenantSlug, meetingType, cancelled }: Props) {
  return (
    <div className='rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl flex flex-col'>
      <div className='mb-4'>
        <div className='text-base font-semibold tracking-tight text-zinc-50'>Actions</div>
        <div className='mt-1 text-sm text-zinc-300'>{cancelled ? "Want to book again?" : "Want another time?"}</div>
      </div>

      <div className='flex-1 space-y-2'>
        <Link
          to='/$tenantSlug/$meetingType'
          params={{ tenantSlug, meetingType }}
          className='block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center text-sm font-semibold text-zinc-100 hover:bg-black/30 transition'
        >
          Choose another time
        </Link>

        <Link
          to='/$tenantSlug'
          params={{ tenantSlug }}
          className='block w-full rounded-2xl bg-emerald-500/90 hover:bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-black transition'
        >
          Back to profile
        </Link>

        <div className='pt-2 text-center text-[11px] text-zinc-400'>
          If you don’t see the email, check spam/promotions.
        </div>
      </div>
    </div>
  );
}
