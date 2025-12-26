// src/types/api.ts
export type PublicSlugResponse = {
  tenant: {
    id: string;
    slug: string;
    name: string;
  };
  meetingTypes: Array<{
    slug: string;
    name: string;
    durationMinutes: number;
    locationType: string;
    locationValue: string;
    hostName: string | null;
    hostSlug: string | null;
    timezone: string;
  }>;
};

export type Slot = { startsAt: string; endsAt?: string };

export type SlotsResponse = {
  timezone: string;
  meetingType: { slug: string; durationMinutes: number };
  range: { from: string; to: string }; // YYYY-MM-DD
  slots: Slot[];
};

export type BookRequest = {
  meetingType: string;
  startsAt: string; // ISO UTC
  guestName: string;
  guestEmail: string;
};

export type BookResponse = {
  booking: {
    id: string;
    status: "CONFIRMED" | "CANCELLED";
    startsAt: string;
    endsAt: string;
    guestName: string;
    guestEmail: string;
    // cancelToken exists in backend response today, but DON'T use it in UI
    cancelToken?: string;
  };
};
