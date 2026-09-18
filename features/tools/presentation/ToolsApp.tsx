"use client";

import { useEffect, useState } from "react";
import { trackAnalytics } from "@/features/analytics/application/track-analytics";
import { loadAppData, type AppDataRepository } from "../application/load-app-data";
import type { AppData } from "../domain/entities";
import { HomeModule } from "./modules/HomeModule";
import { LibraryModule } from "./modules/LibraryModule";
import { OvrModule } from "./modules/OvrModule";
import { PlayersModule } from "./modules/PlayersModule";
import { RankingsModule } from "./modules/RankingsModule";
import { ReviewsModule } from "./modules/ReviewsModule";
import { ShardIqModule } from "./modules/ShardIqModule";
import { isToolTab, toolTabs, type ToolTab } from "./tools-navigation";

export default function ToolsApp({ repository }: { repository: AppDataRepository }) {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ToolTab>("home");

  function openTab(tab: ToolTab, source = "tools_home") {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === "home") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
    trackAnalytics("tool_open", { tool: tab, source });
  }

  function retryDataLoad() {
    trackAnalytics("data_load", { status: "retry" });
    location.reload();
  }

  useEffect(() => {
    const syncTabWithUrl = () => {
      const requested = new URL(window.location.href).searchParams.get("tab");
      setActiveTab(isToolTab(requested) ? requested : "home");
    };
    syncTabWithUrl();
    window.addEventListener("popstate", syncTabWithUrl);
    return () => window.removeEventListener("popstate", syncTabWithUrl);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const startedAt = performance.now();
    loadAppData(repository, controller.signal)
      .then((payload) => {
        setData(payload);
        trackAnalytics("data_load", {
          status: "success",
          duration_ms: Math.round(performance.now() - startedAt),
          player_count: payload.latestPlayers.length,
          review_count: payload.reviews.length,
        });
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(String(reason));
        trackAnalytics("data_load", {
          status: "failure",
          error_type: reason instanceof Error ? reason.name : "unknown",
        });
      });
    return () => controller.abort();
  }, [repository]);

  return (
    <main className="tools-shell">
      <nav className="tools-nav" aria-label="Công cụ FCMaddict">
        {toolTabs.map((tab) => <button className={activeTab === tab.id ? "active" : ""} key={tab.id} onClick={() => openTab(tab.id, "tools_nav")}><span>{tab.short}</span>{tab.label}</button>)}
      </nav>
      <div className="tools-content">
        {!data && !error && <div className="tool-loading"><span /><h1>Đang tải dữ liệu FC Mobile…</h1></div>}
        {error && <div className="tool-error"><h1>Không tải được dữ liệu</h1><p>{error}</p><button className="button button-primary" onClick={retryDataLoad}>Thử lại</button></div>}
        {data && <>
          {activeTab === "home" && <HomeModule data={data} openTab={openTab} />}
          {activeTab === "players" && <PlayersModule data={data} />}
          {activeTab === "reviews" && <ReviewsModule data={data} />}
          {activeTab === "rankings" && <RankingsModule data={data} />}
          {activeTab === "shardiq" && <ShardIqModule data={data} />}
          {activeTab === "ovr" && <OvrModule />}
          {activeTab === "library" && <LibraryModule data={data} />}
          <p className="data-stamp">Dữ liệu đồng bộ: {new Date(data.generatedAt).toLocaleString("vi-VN")}</p>
        </>}
      </div>
    </main>
  );
}
