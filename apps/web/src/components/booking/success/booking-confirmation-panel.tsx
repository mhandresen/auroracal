type Props = {
  cancelled: boolean;
  guestName: string;
  guestEmail: string;
};

export function BookingConfirmationPanel({ cancelled, guestName, guestEmail }: Props) {
  return (
    <div className='rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl'>
      <div className='text-base font-semibold tracking-tight text-zinc-50'>
        {cancelled ? "Status" : "Confirmation sent"}
      </div>
      <div className='mt-1.5 text-sm text-zinc-300'>
        {cancelled
          ? "This booking has been cancelled and no longer blocks availability."
          : "Check your inbox for the calendar invite and cancellation link."}
      </div>

      <div className='my-5 h-px bg-white/10' />

      <div className='space-y-2 text-sm'>
        <div className='rounded-2xl border border-white/10 bg-black/20 p-3'>
          <div className='text-[11px] font-medium tracking-wide text-zinc-400'>Invite</div>
          <div className='mt-1 text-xs text-zinc-300'>
            {cancelled ? "If you added it to your calendar, remove it there." : "Attached as an .ics file."}
          </div>
        </div>

        <div className='rounded-2xl border border-white/10 bg-black/20 p-3'>
          <div className='text-[11px] font-medium tracking-wide text-zinc-400'>Guest</div>
          <div className='mt-1 text-xs font-medium text-zinc-200'>
            {guestName} · {guestEmail}
          </div>
        </div>

        {!cancelled && (
          <div className='rounded-2xl border border-white/10 bg-black/20 p-3'>
            <div className='text-[11px] font-medium tracking-wide text-zinc-400'>Need to cancel?</div>
            <div className='mt-1 text-xs text-zinc-300'>Use the link in the confirmation email.</div>
          </div>
        )}
      </div>
    </div>
  );
}
