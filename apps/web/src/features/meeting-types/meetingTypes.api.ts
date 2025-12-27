import { authorizedFetch } from "../../lib/http";

export type MeetingType = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  durationMinutes: number;
  locationType: "manual";
  locationValue: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMeetingTypeInput = {
  name: string;
  slug?: string;
  durationMinutes?: number;
  locationType?: "manual";
  locationValue?: string | null;
};

export type UpdateMeetingTypeInput = Partial<CreateMeetingTypeInput>;

export function listMeetingTypes(): Promise<MeetingType[]> {
  return authorizedFetch("/_api/v1/app/meeting-types");
}

export function createMeetingType(input: CreateMeetingTypeInput): Promise<MeetingType> {
  return authorizedFetch("/_api/v1/app/meeting-types", { method: "POST", body: JSON.stringify(input) });
}

export function updateMeetingType(id: string, input: UpdateMeetingTypeInput): Promise<MeetingType> {
  return authorizedFetch(`/_api/v1/app/meeting-types/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteMeetingType(id: string): Promise<MeetingType> {
  return authorizedFetch(`/_api/v1/app/meeting-types/${id}`, { method: "DELETE" });
}
