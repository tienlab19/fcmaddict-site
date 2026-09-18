import assert from "node:assert/strict";
import test from "node:test";

import { analyticsEventNames } from "../features/analytics/domain/analytics.ts";
import {
  registerAnalyticsTracker,
  trackAnalytics,
} from "../features/analytics/application/track-analytics.ts";

test("tên event tương thích quy tắc GA4", () => {
  for (const eventName of analyticsEventNames) {
    assert.match(eventName, /^[a-z][a-z0-9_]*$/);
    assert.ok(eventName.length <= 40);
  }
});

test("event được giữ lại cho tới khi Firebase sẵn sàng", () => {
  const events = [];
  trackAnalytics("tool_open", { tool: "players" });
  registerAnalyticsTracker({ track: (event) => events.push(event) });
  trackAnalytics("ovr_reset", { formation: "4-3-3" });

  assert.deepEqual(events, [
    { name: "tool_open", params: { tool: "players" } },
    { name: "ovr_reset", params: { formation: "4-3-3" } },
  ]);
});
