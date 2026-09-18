import type { Metadata } from "next";
import appData from "@/public/data/app-data.json";
import { SiteFooter, SiteHeader } from "../_components/SiteChrome";
import RedeemCodesList from "./RedeemCodesList";

export const metadata: Metadata = {
  title: "Mã quà tặng FC Mobile — FCMaddict",
  description:
    "Danh sách mã quà tặng FC Mobile đang hoạt động và đã hết hạn, cập nhật từ FCMaddict.",
};

export default function RedeemCodesPage() {
  return (
    <div className="site-shell">
      <SiteHeader current="tools" />
      <main className="redeem-page section-wrap">
        <header className="redeem-page-header">
          <p className="eyebrow">FC MOBILE REDEEM CODES</p>
          <h1>Mã quà tặng FC Mobile</h1>
          <p>
            Nhập mã tại{" "}
            <a href="https://redeem.fcm.ea.com/" target="_blank" rel="noreferrer">
              redeem.fcm.ea.com ↗
            </a>
          </p>
        </header>
        <RedeemCodesList codes={appData.codes} />
      </main>
      <SiteFooter />
    </div>
  );
}
