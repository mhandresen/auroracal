import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { NotFound } from "@/components/not-found";

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

    user: { id: string; slug: string; name: string | null; timezone: string };

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

type CancelResponse = { ok: true };

function formatDayLabelFromISO(isoUtc: string) {
  const d = new Date(isoUtc);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function formatTimeLocal(isoUtc: string) {
  const d = new Date(isoUtc);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export const Route = createFileRoute("/booking/$id/cancel")({
  validateSearch: (search: Record<string, unknown>) => {
    const token = typeof search.token === "string" ? search.token : undefined;
    return { token };
  },
  component: CancelBookingPage,
});

function CancelBookingPage() {
  const { id } = Route.useParams();
  const { token } = Route.useSearch();

  const queryClient = useQueryClient();

  // Fetch booking info for nice UI + links (refresh-proof)
  const bookingQuery = useQuery<PublicBookingResponse>({
    queryKey: ["public-booking", id],
    queryFn: () => api<PublicBookingResponse>(`/_api/v1/public/booking/${id}`),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Missing cancel token");
      // tweak this URL if your controller path differs
      return api<CancelResponse>(`/_api/v1/public/booking/${id}/cancel?token=${encodeURIComponent(token)}`, {
        method: "POST",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["public-booking", id] });
    },
  });

  // Ensure we only attempt cancellation once on mount
  const [attempted, setAttempted] = useState(false);
  useEffect(() => {
    if (attempted) return;
    setAttempted(true);

    // Only fire if token exists
    if (token) cancelMutation.mutate();
  }, [attempted, token, cancelMutation]);

  if (!token) {
    return (
      <main className='min-h-screen bg-white dark:bg-dark-100 grid place-items-center px-6'>
        <NotFound
          title='Missing token'
          message='This cancellation link is incomplete. Please use the link from your email.'
        />
      </main>
    );
  }

  const b = bookingQuery.data?.booking ?? null;

  const hostName = b ? (b.user.name ?? b.user.slug) : "Booking";
  const hostTz = b?.user.timezone ?? "UTC";

  const meetingName = b?.meetingType.name ?? "Meeting";
  const duration = b?.meetingType.durationMinutes ?? null;

  const alreadyCancelled = b?.status === "CANCELLED";
  const cancelOk = cancelMutation.isSuccess;
  const cancelFailed = cancelMutation.isError;

  const statusTitle = cancelFailed
    ? "Cancellation failed"
    : alreadyCancelled
      ? "Already cancelled"
      : cancelOk
        ? "Booking cancelled ✅"
        : "Cancelling…";

  const statusText = cancelFailed
    ? "This link may be invalid or expired. Double-check the email link and try again."
    : alreadyCancelled
      ? "This booking was already cancelled and no longer blocks availability."
      : cancelOk
        ? "Your booking has been cancelled. You can book another time whenever you want."
        : "Please wait while we cancel the booking…";

  // Where to send users next
  const backToProfileHref = b ? `/${b.user.slug}` : "/";

  return (
    <main className='relative min-h-screen w-full bg-white dark:bg-dark-100 bg-grid-black/6 dark:bg-grid-white/4 flex items-center justify-center overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.75))] dark:bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.85))]' />

      <section className='relative z-10 w-full max-w-6xl px-6 py-16'>
        <div className='rounded-2xl border border-dark-700/20 dark:border-dark-300 bg-[#FAFAFA]/90 dark:bg-dark-200/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/5'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-xl font-semibold text-black dark:text-white'>{statusTitle}</div>
              <div className='mt-1 text-sm text-black/60 dark:text-white/60'>
                Booking ID: <span className='font-mono text-black/70 dark:text-white/70'>{id}</span>
              </div>
            </div>

            <a
              href={backToProfileHref}
              className='rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
            >
              Back
            </a>
          </div>

          <div className='mt-8 grid gap-6 lg:grid-cols-[320px_360px_1fr]'>
            {/* LEFT: booking summary */}
            <div className='rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6'>
              <div className='flex items-start gap-4'>
                <div className='h-16 w-16 rounded-full border-2 border-primary/30 bg-black/10 dark:bg-white/10 flex items-center justify-center text-xl font-medium text-black dark:text-white'>
                  {hostName.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                  <div className='text-lg font-semibold text-black dark:text-white'>{hostName}</div>
                  <div className='text-sm text-black/60 dark:text-white/60'>{meetingName}</div>
                </div>
              </div>

              <div className='mt-4 h-px bg-black/10 dark:bg-white/10' />

              <div className='mt-4 space-y-2 text-sm text-black/70 dark:text-white/70'>
                <div className='flex items-center gap-2'>
                  <span className='text-black/50 dark:text-white/50'>⏱</span>
                  <span>{duration ? `${duration} min` : "—"}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-black/50 dark:text-white/50'>🌍</span>
                  <span>{hostTz}</span>
                </div>
              </div>

              <div className='mt-6 h-px bg-black/10 dark:bg-white/10' />

              {bookingQuery.isLoading ? (
                <div className='mt-4 animate-pulse'>
                  <div className='h-4 w-28 rounded bg-black/10 dark:bg-white/10' />
                  <div className='mt-3 h-10 rounded bg-black/10 dark:bg-white/10' />
                </div>
              ) : b ? (
                <div className='mt-4 text-sm text-black/70 dark:text-white/70'>
                  <div className='text-xs font-medium text-black/50 dark:text-white/50 tracking-wide'>
                    Scheduled time
                  </div>
                  <div className='mt-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2'>
                    <div className='text-black dark:text-white font-medium'>{formatDayLabelFromISO(b.startsAt)}</div>
                    <div className='text-black/70 dark:text-white/70'>
                      {formatTimeLocal(b.startsAt)} – {formatTimeLocal(b.endsAt)} (your local time)
                    </div>
                  </div>
                </div>
              ) : (
                <div className='mt-4 text-sm text-black/70 dark:text-white/70'>Could not load booking details.</div>
              )}
            </div>

            {/* MIDDLE: status + explanation */}
            <div className='rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6'>
              <div className='text-lg font-medium text-black dark:text-white'>Status</div>
              <div className='mt-2 text-sm text-black/60 dark:text-white/60'>{statusText}</div>

              <div className='mt-6 space-y-3'>
                <div className='rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4'>
                  <div className='text-xs font-medium text-black/50 dark:text-white/50 tracking-wide'>
                    What happens now
                  </div>
                  <div className='mt-1 text-sm text-black/70 dark:text-white/70'>
                    {cancelFailed
                      ? "If this keeps failing, request a new cancel link from the organizer."
                      : "This slot is free again. You can book a new time immediately."}
                  </div>
                </div>

                {cancelFailed ? (
                  <div className='rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-black dark:text-white'>
                    {(cancelMutation.error as Error)?.message ?? "Cancellation failed."}
                  </div>
                ) : null}
              </div>
            </div>

            {/* RIGHT: actions */}
            <div className='rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 flex flex-col'>
              <div className='mb-4'>
                <div className='text-lg font-medium text-black dark:text-white mb-1'>Actions</div>
                <div className='text-sm text-black/60 dark:text-white/60'>Where to next?</div>
              </div>

              <div className='flex-1 space-y-3'>
                {b ? (
                  <Link
                    to='/$slug/$meetingType'
                    params={{ slug: b.user.slug, meetingType: b.meetingType.slug }}
                    className='block w-full text-center rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-sm font-semibold text-black transition'
                  >
                    Book another time
                  </Link>
                ) : (
                  <a
                    href={backToProfileHref}
                    className='block w-full text-center rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-sm font-semibold text-black transition'
                  >
                    Back to booking page
                  </a>
                )}

                <a
                  href={backToProfileHref}
                  className='block w-full text-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm font-semibold text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition'
                >
                  Back to profile
                </a>

                <div className='pt-2 text-xs text-black/50 dark:text-white/50 text-center'>
                  If you cancelled by mistake, just book a new time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
