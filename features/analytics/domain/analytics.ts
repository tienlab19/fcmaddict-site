export const analyticsEventNames = [
  "page_view",
  "navigation_click",
  "support_contact",
  "content_expand",
  "tool_open",
  "data_load",
  "player_search",
  "ranking_view",
  "shardiq_run",
  "ovr_calculate",
  "ovr_reset",
  "library_view",
  "redeem_code_copy",
  "asset_download",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsValue = string | number;
export type AnalyticsParams = Record<string, AnalyticsValue | undefined>;

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  params?: AnalyticsParams;
};

export interface AnalyticsTracker {
  track(event: AnalyticsEvent): void;
}
