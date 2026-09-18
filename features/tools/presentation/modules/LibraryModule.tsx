/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { trackAnalytics } from "@/features/analytics/application/track-analytics";
import type { AppData, Asset } from "../../domain/entities";
import { copyRedeemCode } from "../copy-redeem-code";
import { EmptyState } from "../components/EmptyState";
import { ImageOrInitial } from "../components/ImageOrInitial";

function AssetGrid({ items, assetType }: { items: Asset[]; assetType: "player" | "icon" }) {
  return <div className="asset-grid">{items.map((item) => <article key={item.id}><ImageOrInitial src={item.image} name={item.name} /><div><h3>{item.name || "FC Mobile"}</h3><p>{[item.primary, item.secondary].filter(Boolean).join(" · ")}</p></div><a href={item.image} download target="_blank" rel="noreferrer" data-analytics-ignore="true" onClick={() => trackAnalytics("asset_download", { asset_id: item.id, asset_type: assetType })}>Tải</a></article>)}</div>;
}

export function LibraryModule({ data }: { data: AppData }) {
  const [section, setSection] = useState<"codes" | "cards" | "players" | "icons">("codes");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const normalized = query.trim().toLowerCase();
  const cards = data.cards.filter((card) => !normalized || [card.title, card.type].some((value) => value.toLowerCase().includes(normalized)));
  const playerRenders = data.playerRenders.filter((item) => !normalized || [item.name, item.primary, item.secondary].some((value) => value.toLowerCase().includes(normalized)));
  const iconRenders = data.iconRenders.filter((item) => !normalized || [item.name, item.primary, item.secondary].some((value) => value.toLowerCase().includes(normalized)));
  useEffect(() => {
    const itemCount = section === "codes"
      ? data.codes.filter((code) => code.active).length
      : section === "cards"
        ? data.cards.length
        : section === "players"
          ? data.playerRenders.length
          : data.iconRenders.length;
    trackAnalytics("library_view", { section, item_count: itemCount });
  }, [data, section]);
  return (
    <div className="tool-view-stack">
      <section className="tool-panel filter-panel"><div><p className="eyebrow">FC MOBILE LIBRARY</p><h1>Thư viện</h1><p>Mã quà tặng, mẫu thẻ và ảnh render.</p></div><div className="position-pills"><button className={section === "codes" ? "active" : ""} onClick={() => { setSection("codes"); setVisibleCount(24); }}>Mã quà tặng</button><button className={section === "cards" ? "active" : ""} onClick={() => { setSection("cards"); setVisibleCount(24); }}>Mẫu thẻ</button><button className={section === "players" ? "active" : ""} onClick={() => { setSection("players"); setVisibleCount(24); }}>Player renders</button><button className={section === "icons" ? "active" : ""} onClick={() => { setSection("icons"); setVisibleCount(24); }}>Icon renders</button></div></section>
      {section !== "codes" && <input className="library-search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(24); }} placeholder="Tìm theo tên, CLB, quốc gia hoặc loại thẻ…" />}
      {section === "codes" && <><div className="codes-grid">{data.codes.filter((code) => code.active).map((code) => <button key={code.id} onClick={() => void copyRedeemCode(code, "library")}><span>ACTIVE</span><b>{code.code}</b><p>{code.reward || "Phần thưởng FC Mobile"}</p><small>{code.addedDate || "Nhấn để sao chép"}</small></button>)}</div><a className="button button-secondary library-full-link" href="/redeem-codes">Xem toàn bộ mã đang hoạt động và hết hạn</a></>}
      {section === "cards" && <div className="official-card-grid">{cards.slice(0, visibleCount).map((card) => <article key={card.id}><img src={card.image} alt={card.title} loading="lazy" /><div><span><b>{card.title}</b><small>{card.type}</small></span><a href={card.animatedImage || card.image} download target="_blank" rel="noreferrer" data-analytics-ignore="true" onClick={() => trackAnalytics("asset_download", { asset_id: card.id, asset_type: "card" })}>Tải</a></div></article>)}</div>}
      {section === "players" && <AssetGrid items={playerRenders.slice(0, visibleCount)} assetType="player" />}
      {section === "icons" && <AssetGrid items={iconRenders.slice(0, visibleCount)} assetType="icon" />}
      {section !== "codes" && ((section === "cards" && !cards.length) || (section === "players" && !playerRenders.length) || (section === "icons" && !iconRenders.length)) && <EmptyState>Không tìm thấy tài nguyên phù hợp.</EmptyState>}
      {section === "cards" && visibleCount < cards.length && <button className="button button-secondary load-more-button" onClick={() => setVisibleCount((count) => count + 24)}>Xem thêm mẫu thẻ</button>}
      {section === "players" && visibleCount < playerRenders.length && <button className="button button-secondary load-more-button" onClick={() => setVisibleCount((count) => count + 24)}>Xem thêm player render</button>}
      {section === "icons" && visibleCount < iconRenders.length && <button className="button button-secondary load-more-button" onClick={() => setVisibleCount((count) => count + 24)}>Xem thêm icon render</button>}
    </div>
  );
}
