export type ProviderId = 'stripchat' | 'chaturbate' | 'unknown';

export type ConversionStatus = 'pending' | 'approved' | 'rejected';

export type ConversionEvent = {
  eventId: string;
  provider: ProviderId;
  status: ConversionStatus;
  payout: number;
  currency: string;
  clickId?: string;
  username?: string;
  externalTxnId?: string;
  timestamp: number;
  sourceIp?: string;
  raw: Record<string, unknown>;
};

const MAX_EVENTS = 10_000;

const ids = new Set<string>();
const events: ConversionEvent[] = [];

export const getConversionEvents = (): ConversionEvent[] => events;

export const addConversionEvent = (event: ConversionEvent): { duplicate: boolean; event: ConversionEvent } => {
  if (ids.has(event.eventId)) {
    const existing = events.find((item) => item.eventId === event.eventId) || event;
    return { duplicate: true, event: existing };
  }

  ids.add(event.eventId);
  events.push(event);

  if (events.length > MAX_EVENTS) {
    const removed = events.shift();
    if (removed) ids.delete(removed.eventId);
  }

  return { duplicate: false, event };
};
