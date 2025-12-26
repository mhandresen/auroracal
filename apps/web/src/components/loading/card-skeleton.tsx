export function CardSkeleton() {
  return (
    <div className='animate-pulse space-y-3'>
      <div className='h-4 w-32 rounded bg-black/10 dark:bg-white/10' />
      <div className='h-4 w-48 rounded bg-black/10 dark:bg-white/10' />
    </div>
  );
}
