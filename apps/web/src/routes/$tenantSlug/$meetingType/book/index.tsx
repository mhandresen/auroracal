import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotFound } from "@/components/not-found";
import { api } from "@/lib/api";
import type { BookRequest, BookResponse, PublicSlugResponse } from "@/types/api";
import { looksLikeEmail } from "@/utils/misc";
import { formatDayLabelFromISO } from "@/utils/calendar";
import { formatTimeLocal } from "@/utils/date";
import { PublicMeetingTypeLayout } from "@/components/layouts/public-meeting-type";
import { GlassCard2 } from "@/components/ui/glass-card";

export const Route = createFileRoute("/$tenantSlug/$meetingType/book/")({
  validateSearch: (search: Record<string, unknown>) => {
    const startsAt = typeof search.startsAt === "string" ? search.startsAt : undefined;
    return { startsAt };
  },
  component: BookPage,
});

function BookPage() {
  const { tenantSlug, meetingType } = Route.useParams();
  const { startsAt } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Guard: user must come from selection step
  if (!startsAt) {
    return <NotFound title='Missing time selection' message='Pick a time first, then continue.' styled />;
  }

  const publicQuery = useQuery<PublicSlugResponse>({
    queryKey: ["public-slug", tenantSlug],
    queryFn: () => api<PublicSlugResponse>(`/api/v1/public/${tenantSlug}`),
  });

  const mt = useMemo(() => {
    return publicQuery.data?.meetingTypes.find((x) => x.slug === meetingType) ?? null;
  }, [publicQuery.data, meetingType]);

  // Form
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const canSubmit =
    !!mt &&
    !!publicQuery.data &&
    guestName.trim().length >= 2 &&
    looksLikeEmail(guestEmail) &&
    !isNaN(Date.parse(startsAt));

  const bookingMutation = useMutation({
    mutationFn: async () => {
      const body: BookRequest = {
        meetingType,
        startsAt,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
      };
      return api<BookResponse>(`/api/v1/public/${tenantSlug}/book`, {
        method: "POST",
        body,
      } as any);
    },
    onSuccess: async (res) => {
      // Slots now stale if they go back
      await qc.invalidateQueries({ queryKey: ["slots", tenantSlug, meetingType] });

      // Go to success page (make this next)
      navigate({
        to: "/$tenantSlug/$meetingType/success",
        params: { tenantSlug, meetingType },
        search: {
          bookingId: res.booking.id,
        },
        replace: true,
      });
    },
  });

  if (publicQuery.isLoading) {
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

  if (publicQuery.isError || !publicQuery.data) {
    return <NotFound title='Booking page not found' message={`No booking page exists for "${tenantSlug}".`} styled />;
  }

  if (!mt) {
    return (
      <NotFound
        title='Meeting type not found'
        message={`"${meetingType}" does not exist for "${tenantSlug}".`}
        styled
      />
    );
  }

  const displayName = mt?.hostName ?? mt?.hostSlug ?? publicQuery.data.tenant.name ?? "";
  const hostTz = mt?.timezone ?? "";

  const isConflict =
    bookingMutation.isError &&
    typeof (bookingMutation.error as any)?.message === "string" &&
    (bookingMutation.error as any).message.toLowerCase().includes("slot already booked");

  return (
    <PublicMeetingTypeLayout>
      <GlassCard2>
        <div className='flex items-center justify-between'>
          <div>
            <div className='text-xl font-semibold text-black dark:text-white'>Confirm your booking</div>
            <div className='mt-1 text-sm text-black/60 dark:text-white/60'>
              Enter your details and we’ll email you a calendar invite.
            </div>
          </div>

          <Link
            to='/$tenantSlug/$meetingType'
            params={{ tenantSlug, meetingType }}
            className='rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
          >
            ← Back
          </Link>
        </div>

        <div className='mt-8 grid gap-6 lg:grid-cols-[320px_360px_1fr]'>
          {/* LEFT: summary */}
          <div className='rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6'>
            <div className='flex items-start gap-4'>
              <div className='h-16 w-16 rounded-full border-2 border-primary/30 bg-black/10 dark:bg-white/10 flex items-center justify-center text-xl font-medium text-black dark:text-white'>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className='flex-1'>
                <div className='text-lg font-semibold text-black dark:text-white'>{displayName}</div>
                <div className='text-sm text-black/60 dark:text-white/60'>{mt.name}</div>
              </div>
            </div>

            <div className='mt-4 h-px bg-black/10 dark:bg-white/10' />

            <div className='mt-4 space-y-2 text-sm text-black/70 dark:text-white/70'>
              <div className='flex items-center gap-2'>
                <span className='text-black/50 dark:text-white/50'>⏱</span>
                <span>{mt.durationMinutes} min</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-black/50 dark:text-white/50'>🌍</span>
                <span>{hostTz}</span>
              </div>
            </div>

            <div className='mt-6 h-px bg-black/10 dark:bg-white/10' />

            <div className='mt-4 text-sm text-black/70 dark:text-white/70'>
              <div className='text-xs font-medium text-black/50 dark:text-white/50 tracking-wide'>Selected time</div>
              <div className='mt-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2'>
                <div className='text-black dark:text-white font-medium'>{formatDayLabelFromISO(startsAt)}</div>
                <div className='text-black/70 dark:text-white/70'>{formatTimeLocal(startsAt)} (your local time)</div>
              </div>
            </div>
          </div>

          {/* MIDDLE: info + errors */}
          <div className='rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6'>
            <div className='text-lg font-medium text-black dark:text-white'>What you’ll get</div>
            <div className='mt-2 text-sm text-black/60 dark:text-white/60'>Clean, simple, no spam.</div>

            <div className='mt-6 space-y-3'>
              <div className='rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4'>
                <div className='text-xs font-medium text-black/50 dark:text-white/50 tracking-wide'>
                  Email confirmation
                </div>
                <div className='mt-1 text-sm text-black/70 dark:text-white/70'>We’ll send you the meeting details.</div>
              </div>

              <div className='rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4'>
                <div className='text-xs font-medium text-black/50 dark:text-white/50 tracking-wide'>
                  Calendar invite
                </div>
                <div className='mt-1 text-sm text-black/70 dark:text-white/70'>
                  An .ics file is attached automatically.
                </div>
              </div>

              {bookingMutation.isError ? (
                <div className='rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-black dark:text-white'>
                  {isConflict ? (
                    <>
                      That time was just booked by someone else. Go back and pick another slot.
                      <div className='mt-3'>
                        <Link
                          to='/$tenantSlug/$meetingType'
                          params={{ tenantSlug, meetingType }}
                          className='inline-flex rounded-lg bg-black/10 dark:bg-white/10 px-3 py-2 text-sm font-medium hover:bg-black/15 dark:hover:bg-white/15'
                        >
                          Choose another time
                        </Link>
                      </div>
                    </>
                  ) : (
                    "Could not complete booking. Please try again."
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* RIGHT: form */}
          <div className='rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 flex flex-col'>
            <div className='mb-4'>
              <div className='text-lg font-medium text-black dark:text-white mb-1'>Your details</div>
              <div className='text-sm text-black/60 dark:text-white/60'>Used only for this booking.</div>
            </div>

            <form
              className='flex-1 flex flex-col gap-4'
              onSubmit={(e) => {
                e.preventDefault();
                if (!canSubmit || bookingMutation.isPending) return;
                bookingMutation.mutate();
              }}
            >
              <div>
                <label className='block text-sm font-medium text-black/70 dark:text-white/70 mb-2'>Name</label>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder='Your name'
                  autoComplete='name'
                  className='w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-dark-100/40 px-3 py-2 text-sm text-black dark:text-white placeholder:text-black/35 dark:placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-primary/40'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black/70 dark:text-white/70 mb-2'>Email</label>
                <input
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder='you@email.com'
                  inputMode='email'
                  autoComplete='email'
                  className='w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-dark-100/40 px-3 py-2 text-sm text-black dark:text-white placeholder:text-black/35 dark:placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-primary/40'
                />
                {guestEmail.length > 2 && !looksLikeEmail(guestEmail) ? (
                  <div className='mt-2 text-xs text-black/60 dark:text-white/60'>Enter a valid email address.</div>
                ) : null}
              </div>

              <div className='mt-auto pt-2'>
                {canSubmit ? (
                  <button
                    type='submit'
                    disabled={bookingMutation.isPending}
                    className='block w-full rounded-2xl bg-emerald-500/90 px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-400 shadow-[0_18px_60px_-30px_rgba(16,185,129,0.8)]'
                  >
                    {bookingMutation.isPending ? "Booking..." : "Book meeting"}
                  </button>
                ) : (
                  <button
                    type='button'
                    disabled
                    className='w-full rounded-lg  bg-black/10 dark:bg-white/10 px-4 py-3 text-sm text-black/40 dark:text-white/40 cursor-not-allowed'
                  >
                    Book meeting
                  </button>
                )}

                <div className='mt-3 text-center text-xs text-black/50 dark:text-white/50'>
                  You’ll receive an email confirmation and calendar invite.
                </div>
              </div>
            </form>
          </div>
        </div>
      </GlassCard2>
    </PublicMeetingTypeLayout>
  );
}
