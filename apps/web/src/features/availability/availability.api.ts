import { authorizedFetch } from "../../lib/http";

export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type TimeRange = { start: string; end: string };
export type WeeklyAvailability = { days: Record<DayKey, { enabled: boolean; ranges: TimeRange[] }> };

export async function getWeeklyAvailability(): Promise<WeeklyAvailability> {
  return authorizedFetch("/_api/v1/app/availability/weekly");
}

export async function saveWeeklyAvailability(input: WeeklyAvailability): Promise<WeeklyAvailability> {
  return authorizedFetch("/_api/v1/app/availability/weekly", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
