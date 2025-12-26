import { createEvent, type EventAttributes } from 'ics';
import { DateTime } from 'luxon';

export function createBookingIcs(input: {
  title: string;
  description?: string;
  startsAtUtcIso: string;
  endsAtUtcIso: string;
}) {
  const start = DateTime.fromISO(input.startsAtUtcIso, { zone: 'utc' });
  const end = DateTime.fromISO(input.endsAtUtcIso, { zone: 'utc' });

  if (!start.isValid || !end.isValid)
    throw new Error('Invalid start or end date for ICS');

  const event: EventAttributes = {
    title: input.title,
    description: input.description ?? '',
    start: [start.year, start.month, start.day, start.hour, start.minute],
    end: [end.year, end.month, end.day, end.hour, end.minute],
    startInputType: 'utc',
    endInputType: 'utc',
    productId: 'meeting-scheduler',
  };

  const { error, value } = createEvent(event);
  if (error || !value) throw error ?? new Error('Failed to create ICS');

  return value;
}
