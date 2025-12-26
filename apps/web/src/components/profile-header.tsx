type Chip = { icon?: React.ReactNode; label: string };

export function ProfileHeader({
  name,
  subtitle,
  avatarUrl,
  chips = [],
}: {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  chips?: Chip[];
}) {
  return (
    <div className='flex items-center gap-6'>
      <div className='relative h-24 w-24 shrink-0'>
        <div className='absolute inset-0 rounded-full ring-2 ring-primary/40 shadow-[0_0_40px_rgba(16,185,129,0.14)]' />
        <div className='absolute inset-1 rounded-full bg-black/10 dark:bg-black/20 overflow-hidden'>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className='h-full w-full object-cover' />
          ) : (
            <div className='h-full w-full grid place-items-center text-dark-600 dark:text-white/60'>
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className='min-w-0'>
        <h1 className='text-3xl font-semibold tracking-tight text-dark-900 dark:text-white'>{name}</h1>
        <p className='mt-1 text-sm text-black/60 dark:text-white/50'>Select a meeting to book time</p>

        {subtitle ? <p className='mt-1 text-dark-600 dark:text-white/60'>{subtitle}</p> : null}

        <div className='mt-4 flex flex-wrap gap-2'>
          {chips.map((chip, idx) => (
            <span
              key={idx}
              className='inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-sm text-dark-700 dark:text-white/70'
            >
              {chip.icon ? <span className='text-white/50'>{chip.icon}</span> : null}
              <span className='truncate'>{chip.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
