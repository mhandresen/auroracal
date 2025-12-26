import { PublicMeetingTypeSkeleton } from "@/components/loading/public-meeting-type-skeleton";
import { NotFound } from "@/components/not-found";
import { useMeetingTypeBooking } from "@/hooks/use-meeting-type-booking";
import { createFileRoute } from "@tanstack/react-router";
import { PublicMeetingTypeLayout } from "../../../components/layouts/public-meeting-type";
import { GlassCard2 } from "../../../components/ui/glass-card";
import { CalendarPanel } from "./components/calendar-panel";
import { ProfilePanel } from "./components/profile-panel";
import { TimeSlotsPanel } from "./components/timeslots-panel";

export const Route = createFileRoute("/$tenantSlug/$meetingType/")({
  component: MeetingTypePage,
});

function MeetingTypePage() {
  const { tenantSlug, meetingType } = Route.useParams();

  const booking = useMeetingTypeBooking({ tenantSlug, meetingType });

  if (booking.publicQuery.isLoading) {
    return <PublicMeetingTypeSkeleton />;
  }

  if (booking.publicQuery.isError || !booking.publicQuery.data) {
    return <NotFound title='Booking page not found' message={`No booking page exists for "${tenantSlug}".`} styled />;
  }

  if (!booking.mt) {
    return (
      <NotFound
        title='Meeting type not found'
        message={`"${meetingType}" does not exist for "${tenantSlug}".`}
        styled
      />
    );
  }

  return (
    <PublicMeetingTypeLayout>
      <GlassCard2>
        <div className='grid gap-6 lg:grid-cols-[320px_1fr_320px]'>
          <ProfilePanel displayName={booking.displayName} mt={booking.mt} timezone={booking.timezone} />

          <CalendarPanel
            title={booking.cal.title}
            cells={booking.cal.cells}
            selectedDay={booking.selectedDay}
            isSelectableDay={booking.isSelectableDay}
            inRange={booking.inRange}
            onSelectDay={booking.onSelectDay}
            onPrevMonth={booking.onPrevMonth}
            onNextMonth={booking.onNextMonth}
          />

          <TimeSlotsPanel
            selectedDay={booking.selectedDay}
            groupedSlots={booking.groupedSlots}
            isLoading={booking.slotsQuery.isLoading}
            isError={booking.slotsQuery.isError}
            hasNone={
              !booking.slotsQuery.isLoading && !booking.slotsQuery.isError && booking.slotsForSelectedDay.length === 0
            }
            selectedStartsAt={booking.selectedStartsAt}
            onSelectStartsAt={booking.setSelectedStartsAt}
            confirmHref={booking.confirmHref}
          />
        </div>
      </GlassCard2>
    </PublicMeetingTypeLayout>
  );
}
