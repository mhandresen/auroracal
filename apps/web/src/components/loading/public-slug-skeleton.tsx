export function PublicSlugSkeleton() {
  return (
    <div className='animate-pulse space-y-8'>
      <div className='flex items-center gap-6'>
        <div className='h-24 w-24 rounded-full bg-black/10 dark:bg-white/10' />
        <div className='flex-1 space-y-3'>
          <div className='h-6 w-48 rounded bg-black/10 dark:bg-white/10' />
          <div className='h-4 w-32 rounded bg-black/10 dark:bg-white/10' />
          <div className='flex gap-2 mt-4'>
            <div className='h-6 w-28 rounded-full bg-black/10 dark:bg-white/10' />
            <div className='h-6 w-36 rounded-full bg-black/10 dark:bg-white/10' />
          </div>
        </div>
      </div>

      <div className='h-px w-full bg-black/10 dark:bg-white/10' />

      <div className='space-y-4'>
        <div className='h-16 rounded-xl bg-black/10 dark:bg-white/10' />
        <div className='h-16 rounded-xl bg-black/10 dark:bg-white/10' />
      </div>
    </div>
  );
}
