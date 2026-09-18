import type {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsParams,
  AnalyticsTracker,
} from "../domain/analytics";

const pendingEvents: AnalyticsEvent[] = [];
let tracker: AnalyticsTracker | null = null;

export function registerAnalyticsTracker(nextTracker: AnalyticsTracker) {
  tracker = nextTracker;
  pendingEvents.splice(0).forEach((event) => tracker?.track(event));
}

export function trackAnalytics(
  name: AnalyticsEventName,
  params?: AnalyticsParams,
) {
  const event = { name, params } satisfies AnalyticsEvent;
  if (tracker) {
    tracker.track(event);
    return;
  }

  if (pendingEvents.length === 100) pendingEvents.shift();
  pendingEvents.push(event);
}
