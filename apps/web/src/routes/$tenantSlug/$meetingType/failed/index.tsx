import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$tenantSlug/$meetingType/failed/")({
  validateSearch: (search: Record<string, unknown>) => {
    const reason = typeof search.reason === "string" ? search.reason : "Could not complete booking.";
    return { reason };
  },
  component: FailedPage,
});

function FailedPage() {
  const { tenantSlug, meetingType } = Route.useParams();
  const { reason } = Route.useSearch();

  return (
    <main className='relative min-h-screen w-full bg-white dark:bg-dark-100 bg-grid-black/6 dark:bg-grid-white/4 flex items-center justify-center overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.75))] dark:bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.85))]' />

      <section className='relative z-10 w-full max-w-3xl px-6 py-16'>
        <div className='rounded-2xl border border-dark-700/20 dark:border-dark-300 bg-[#FAFAFA]/90 dark:bg-dark-200/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/5'>
          <div className='text-xl font-semibold text-black dark:text-white'>Booking failed</div>
          <div className='mt-2 text-sm text-black/60 dark:text-white/60'>{reason}</div>

          <div className='mt-8 grid gap-3'>
            <Link
              to='/$tenantSlug/$meetingType'
              params={{ tenantSlug, meetingType }}
              className='block w-full text-center rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-sm font-semibold text-black transition'
            >
              Choose another time
            </Link>

            <Link
              to='/$tenantSlug'
              params={{ tenantSlug }}
              className='block w-full text-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm font-semibold text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition'
            >
              Back to profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
