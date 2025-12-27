import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { NotFound } from "@/components/not-found";
import { PublicBookingLayout } from "../../../../components/layouts/public-booking-layout";
import { GlassCard2 } from "../../../../components/ui/glass-card";
import { BookingSummaryPanel } from "../../../../components/booking/success/booking-summary-panel";
import { BookingConfirmationPanel } from "../../../../components/booking/success/booking-confirmation-panel";
import { BookingActionsPanel } from "../../../../components/booking/success/booking-actions-panel";

type PublicBookingResponse = {
  booking: {
    id: string;
    status: "CONFIRMED" | "CANCELLED";
    startsAt: string;
    endsAt: string;
    createdAt: string;

    guestName: string;
    guestEmail: string;

    tenant: { id: string; slug: string; name: string };

    user: {
      id: string;
      slug: string;
      name: string | null;
      timezone: string;
    };

    meetingType: {
      id: string;
      slug: string;
      name: string;
      durationMinutes: number;
      locationType: "manual";
      locationValue: string | null;
    };
  };
};

function formatDayLabelFromISO(isoUtc: string) {
  const d = new Date(isoUtc);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function formatTimeLocal(isoUtc: string) {
  const d = new Date(isoUtc);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export const Route = createFileRoute("/$tenantSlug/$meetingType/success/")({
  validateSearch: (search: Record<string, unknown>) => {
    const bookingId = typeof search.bookingId === "string" ? search.bookingId : undefined;
    return { bookingId };
  },
  component: SuccessPage,
});

function SuccessPage() {
  const { tenantSlug, meetingType } = Route.useParams();
  const { bookingId } = Route.useSearch();

  if (!bookingId) {
    return (
      <main className='min-h-screen bg-white dark:bg-dark-100 grid place-items-center px-6'>
        <NotFound title='Missing booking id' message='Open this page from a completed booking.' />
      </main>
    );
  }

  const bookingQuery = useQuery<PublicBookingResponse>({
    queryKey: ["public-booking", bookingId],
    queryFn: () => api<PublicBookingResponse>(`/_api/v1/public/booking/${bookingId}`),
  });

  if (bookingQuery.isLoading) {
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

  if (bookingQuery.isError || !bookingQuery.data) {
    return (
      <main className='min-h-screen bg-white dark:bg-dark-100 grid place-items-center px-6'>
        <NotFound title='Booking not found' message='This confirmation link may be invalid or expired.' />
      </main>
    );
  }

  const b = bookingQuery.data.booking;

  const hostName = b.user.name ?? b.user.slug;
  const hostTz = b.user.timezone;

  const cancelled = b.status === "CANCELLED";

  return (
    <PublicBookingLayout>
      <GlassCard2>
        <div className='flex items-center justify-between'>
          <div>
            <div className='text-xl font-semibold text-black dark:text-white'>
              {cancelled ? "Booking cancelled" : "You’re booked ✅"}
            </div>
            <div className='mt-1 text-sm text-black/60 dark:text-white/60'>
              Booking ID: <span className='font-mono text-black/70 dark:text-white/70'>{b.id}</span>
            </div>
          </div>

          <Link
            to='/$tenantSlug'
            params={{ tenantSlug }}
            className='rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
          >
            Back to profile
          </Link>
        </div>

        <div className='mt-8 grid gap-6 lg:grid-cols-[320px_360px_1fr]'>
          {/* LEFT: meeting summary */}
          <BookingSummaryPanel
            hostName={hostName}
            meetingName={b.meetingType.name}
            durationMinutes={b.meetingType.durationMinutes}
            hostTz={hostTz}
            startsAt={b.startsAt}
            endsAt={b.endsAt}
            cancelled={cancelled}
            formatDayLabelFromISO={formatDayLabelFromISO}
            formatTimeLocal={formatTimeLocal}
          />

          {/* MIDDLE: confirmation details */}
          <BookingConfirmationPanel cancelled={cancelled} guestName={b.guestName} guestEmail={b.guestEmail} />

          {/* RIGHT: actions */}
          <BookingActionsPanel tenantSlug={tenantSlug} meetingType={meetingType} cancelled={cancelled} />
        </div>
      </GlassCard2>
    </PublicBookingLayout>
  );
}
