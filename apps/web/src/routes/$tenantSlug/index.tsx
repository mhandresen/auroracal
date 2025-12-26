import { createFileRoute } from "@tanstack/react-router";
import { ProfileHeader } from "@/components/profile-header";
import { MeetingTypeCard } from "@/components/meeting-type-card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PublicSlugSkeleton } from "@/components/loading/public-slug-skeleton";
import { NotFound } from "@/components/not-found";
import type { PublicSlugResponse } from "@/types/api";

export const Route = createFileRoute("/$tenantSlug/")({
  component: SlugPage,
});

function SlugPage() {
  const { tenantSlug } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-slug", tenantSlug],
    queryFn: () => api<PublicSlugResponse>(`api/v1/public/${tenantSlug}`),
  });

  return (
    <main className='relative min-h-screen w-full bg-black text-zinc-100 overflow-hidden'>
      {/* background: subtle grid + vignette + glow */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_45%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_55%)]' />
      <div className='pointer-events-none absolute inset-0 bg-grid-white/5' />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85))]' />

      <section className='relative z-10 mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16'>
        <div className='relative w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.65)] ring-1 ring-white/5'>
          {/* subtle inner glow */}
          <div className='pointer-events-none absolute -inset-1 rounded-[28px] bg-emerald-500/10 blur-2xl opacity-40' />

          {isLoading ? (
            <PublicSlugSkeleton />
          ) : isError || !data ? (
            <NotFound title='Booking page not found' message={`No booking page exists for "${tenantSlug}."`} />
          ) : (
            <div className='relative'>
              <ProfileHeader name={data.tenant.name} subtitle={undefined} chips={[{ label: data.tenant.slug }]} />

              <div className='mt-6 h-px w-full bg-white/10' />

              <div className='mt-6 space-y-3'>
                {data.meetingTypes.map((mt) => (
                  <div key={mt.slug} className='group relative'>
                    <div className='pointer-events-none absolute -inset-2 rounded-3xl bg-emerald-500/10 blur-xl opacity-0 transition group-hover:opacity-60' />
                    <div className='relative rounded-3xl border border-white/10 bg-black/20 px-2 py-2'>
                      <MeetingTypeCard
                        title={mt.name}
                        duration={`${mt.durationMinutes} min`}
                        href={`/${tenantSlug}/${mt.slug}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-6 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-400'>
                Tip: Pick a meeting type to see available times.
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
