export type ToolTab = "home" | "players" | "reviews" | "rankings" | "shardiq" | "ovr" | "library";

export const toolTabs: { id: ToolTab; label: string; short: string }[] = [
  { id: "home", label: "Tổng quan", short: "HOME" },
  { id: "players", label: "Cầu thủ", short: "PLAY" },
  { id: "reviews", label: "Review", short: "REV" },
  { id: "rankings", label: "Xếp hạng", short: "TOP" },
  { id: "shardiq", label: "ShardIQ", short: "IQ" },
  { id: "ovr", label: "Tính OVR", short: "OVR" },
  { id: "library", label: "Thư viện", short: "LIB" },
];

export function isToolTab(value: string | null): value is ToolTab {
  return toolTabs.some((tab) => tab.id === value);
}
