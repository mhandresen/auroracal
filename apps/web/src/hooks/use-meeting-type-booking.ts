import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PublicSlugResponse, Slot, SlotsResponse } from "@/types/api";
import {
  addDaysUTC,
  addMonthsUTC,
  endOfMonthUTC,
  formatMonthTitle,
  parseYmdToUTCDate,
  startOfMonthUTC,
  ymdUTC,
} from "@/utils/date";
import { bucketLabel, weekdayIndexMon0 } from "@/utils/calendar";

export type CalCell = { ymd: string | null; inMonth: boolean };

type UseMeetingTypeBookingArgs = {
  tenantSlug: string;
  meetingType: string;
};

export function useMeetingTypeBooking({ tenantSlug, meetingType }: UseMeetingTypeBookingArgs) {
  // Backend requires YYYY-MM-DD
  const range = useMemo(() => {
    const todayUTC = new Date();
    const from = ymdUTC(todayUTC);
    const to = ymdUTC(addDaysUTC(todayUTC, 13));
    return { from, to };
  }, []);

  const publicQuery = useQuery<PublicSlugResponse>({
    queryKey: ["public-slug", tenantSlug],
    queryFn: () => api<PublicSlugResponse>(`/_api/v1/public/${tenantSlug}`),
  });

  const mt = useMemo(() => {
    return publicQuery.data?.meetingTypes.find((x) => x.slug === meetingType) ?? null;
  }, [publicQuery.data, meetingType]);

  const slotsQuery = useQuery<SlotsResponse>({
    enabled: !!mt,
    queryKey: ["slots", tenantSlug, meetingType, range.from, range.to],
    queryFn: () =>
      api<SlotsResponse>(
        `/_api/v1/public/${tenantSlug}/slots?` +
          new URLSearchParams({
            meetingType,
            from: range.from,
            to: range.to,
          }).toString()
      ),
  });

  // Selected day/time
  const [selectedDay, setSelectedDay] = useState<string>(() => range.from);
  const [selectedStartsAt, setSelectedStartsAt] = useState<string | null>(null);

  // Calendar viewport month
  const [monthCursor, setMonthCursor] = useState<Date>(() => startOfMonthUTC(parseYmdToUTCDate(range.from)));

  const slots = slotsQuery.data?.slots ?? [];

  const availableDaysSet = useMemo(() => {
    const set = new Set<string>();
    for (const s of slots) set.add(ymdUTC(new Date(s.startsAt)));
    return set;
  }, [slots]);

  const inRange = useCallback((ymd: string) => ymd >= range.from && ymd <= range.to, [range.from, range.to]);

  const isSelectableDay = useCallback(
    (ymd: string) => inRange(ymd) && availableDaysSet.has(ymd),
    [inRange, availableDaysSet]
  );

  const onSelectDay = useCallback((ymd: string) => {
    setSelectedDay(ymd);
    setSelectedStartsAt(null);
  }, []);

  const onPrevMonth = useCallback(() => setMonthCursor((d) => addMonthsUTC(d, -1)), []);
  const onNextMonth = useCallback(() => setMonthCursor((d) => addMonthsUTC(d, 1)), []);

  const cal = useMemo(() => {
    const start = startOfMonthUTC(monthCursor);
    const end = endOfMonthUTC(monthCursor);

    const startPad = weekdayIndexMon0(start);
    const daysInMonth = end.getUTCDate();

    const cells: CalCell[] = [];

    for (let i = 0; i < startPad; i++) cells.push({ ymd: null, inMonth: false });

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), day));
      cells.push({ ymd: ymdUTC(d), inMonth: true });
    }

    while (cells.length % 7 !== 0) cells.push({ ymd: null, inMonth: false });

    return { title: formatMonthTitle(monthCursor), cells };
  }, [monthCursor]);

  const slotsForSelectedDay = useMemo(() => {
    return slots.filter((s) => ymdUTC(new Date(s.startsAt)) === selectedDay);
  }, [slots, selectedDay]);

  const groupedSlots = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slotsForSelectedDay) {
      const hour = new Date(s.startsAt).getHours();
      const key = bucketLabel(hour);
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    return ["Morning", "Afternoon", "Evening"].map((k) => [k, map.get(k) ?? []] as const);
  }, [slotsForSelectedDay]);

  const displayName = mt?.hostName ?? mt?.hostSlug ?? publicQuery.data?.tenant.name ?? "";
  const timezone = mt?.timezone ?? "";

  const confirmHref = selectedStartsAt
    ? {
        to: "/$tenantSlug/$meetingType/book" as const,
        params: { tenantSlug, meetingType },
        search: { startsAt: selectedStartsAt },
      }
    : null;

  return {
    // queries + guards
    publicQuery,
    slotsQuery,
    mt,

    // user info
    displayName,
    timezone,

    // calendar
    cal,
    selectedDay,
    isSelectableDay,
    inRange,
    onSelectDay,
    onPrevMonth,
    onNextMonth,

    // times
    groupedSlots,
    slotsForSelectedDay,
    selectedStartsAt,
    setSelectedStartsAt,

    // action
    confirmHref,
  };
}
