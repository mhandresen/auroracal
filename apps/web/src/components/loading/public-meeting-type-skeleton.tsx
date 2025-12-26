export function PublicMeetingTypeSkeleton() {
  return (
    <main className='relative min-h-screen w-full bg-white dark:bg-dark-100 bg-grid-black/6 dark:bg-grid-white/4 flex items-center justify-center overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.75))] dark:bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.85))]' />
      <section className='relative z-10 w-full max-w-6xl px-6 py-16'>
        <div className='rounded-2xl border border-dark-700/20 dark:border-dark-300 bg-[#FAFAFA]/90 dark:bg-dark-200/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/5 animate-pulse'>
          <div className='h-24 rounded-xl bg-black/10 dark:bg-white/10' />
          <div className='mt-8 grid gap-6 lg:grid-cols-[320px_360px_1fr]'>
            <div className='h-105 rounded-xl bg-black/10 dark:bg-white/10' />
            <div className='h-105 rounded-xl bg-black/10 dark:bg-white/10' />
            <div className='h-105 rounded-xl bg-black/10 dark:bg-white/10' />
          </div>
        </div>
      </section>
    </main>
  );
}
