import type { Metadata } from "next";
import ToolsAppContainer from "@/features/tools/ToolsAppContainer";
import { SiteFooter, SiteHeader } from "../_components/SiteChrome";

export const metadata: Metadata = {
  title: "Công cụ FC Mobile — FCMaddict",
  description: "Tra cứu cầu thủ, xếp hạng, ShardIQ, tính OVR, mã quà tặng và thư viện FC Mobile trên web.",
};

export default function ToolsPage() {
  return (
    <div className="site-shell">
      <SiteHeader current="tools" />
      <ToolsAppContainer />
      <SiteFooter />
    </div>
  );
}
