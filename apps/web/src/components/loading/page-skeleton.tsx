export function PageSkeleton() {
  return (
    <div className='animate-pulse space-y-6'>
      <div className='h-24 rounded-xl bg-black/10 dark:bg-white/10' />
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='h-96 rounded-xl bg-black/10 dark:bg-white/10' />
        <div className='h-96 rounded-xl bg-black/10 dark:bg-white/10' />
        <div className='h-96 rounded-xl bg-black/10 dark:bg-white/10' />
      </div>
    </div>
  );
}
