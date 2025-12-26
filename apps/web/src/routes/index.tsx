import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/hero";
import { AuroraBackground } from "@/components/aurora";
import { NavBar } from "../components/home/nav-bar";
import { Footer } from "../components/home/footer";
import { LogoStrip } from "../components/home/logo-strip";
import { SectionHeader } from "../components/home/section-header";
import { FeatureGrid } from "../components/home/feature-grid";
import { SecurityBlocks } from "../components/home/security-blocks";
import { Pricing } from "../components/home/pricing";
import { FinalCTA } from "../components/home/final-cta";
import { DemoShowcase } from "../components/home/demo-showcase";
import { ProfilePanel } from "./$tenantSlug/$meetingType/components/profile-panel";
import { CalendarPanel } from "./$tenantSlug/$meetingType/components/calendar-panel";
import { createMockBooking } from "../utils/mock/mock-meeting-type-booking";
import { TimeSlotsPanel } from "./$tenantSlug/$meetingType/components/timeslots-panel";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

type Props = {
  productName?: string;
  tagline?: string;
  subtagline?: string;
};
function RouteComponent({
  productName = "AuroraCal",
  tagline = "Book meetings without friction",
  subtagline = "A clean, self-hostable scheduling tool built for developers, consultants, and modern teams.",
}: Props) {
  const mockData = createMockBooking();

  return (
    <div className='min-h-screen bg-black text-zine-100 selection:bg-emerald-500/30 selection:text-zinc-50'>
      <AuroraBackground />
      <div className='relative'>
        <NavBar productName={productName} />
        <main className='mx-auto max-w-6xl px-5 pb-20 pt-10 sm:pt-14'>
          <Hero tagline={tagline} subtagline={subtagline} />
          <LogoStrip />
          <section id='features' className='mt-16 sm:mt-20'>
            <SectionHeader
              eyebrow='Designed for velocity'
              title='Everything you need to schedule like a pro'
              subtitle='Fast setup, thoughtful defaults, and the flexibility developers expect.'
            />
            <FeatureGrid />
          </section>
          <section id='demo' className='mt-16 sm:mt-20'>
            <SectionHeader
              eyebrow="Show, don't tell"
              title='A booking experience people actually enjoy'
              subtitle='Crisp UI, instant feedback, and zero confusion — from first click to confirmed invite.'
            />
            <DemoShowcase>
              <ProfilePanel displayName={mockData.displayName} mt={mockData.mt} timezone={mockData.timezone} />
              <CalendarPanel
                cells={mockData.cal.cells}
                inRange={mockData.inRange}
                isSelectableDay={mockData.isSelectableDay}
                title={mockData.cal.title}
                selectedDay={mockData.selectedDay}
                onNextMonth={() => null}
                onPrevMonth={() => null}
                onSelectDay={() => null}
              />
              <TimeSlotsPanel
                groupedSlots={mockData.groupedSlots}
                selectedDay={mockData.selectedDay}
                selectedStartsAt={mockData.slotsForSelectedDay[3].startsAt}
                onSelectStartsAt={() => null}
                isLoading={false}
                isError={false}
                hasNone={false}
                confirmHref={null}
              />
            </DemoShowcase>
          </section>
          <section id='security' className='mt-16 sm:mt-20'>
            <SectionHeader
              eyebrow='Trust'
              title='Self-hostable, secure and transparent'
              subtitle='Own your data, control your infrastructure, and ship with confidence.'
            />
            <SecurityBlocks />
          </section>
          <section id='pricing' className='mt-16 sm:mt-20'>
            <SectionHeader
              eyebrow='Pricing'
              title='Simple plans. No nonsense.'
              subtitle='Start free, upgrade when you need more seats, SSO, or advanced routing.'
            />
            <Pricing />
          </section>
          <FinalCTA productName={productName} />
        </main>
        <Footer productName={productName} />
      </div>
    </div>
  );
}
