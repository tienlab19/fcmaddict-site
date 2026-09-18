/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackAnalytics } from "@/features/analytics/application/track-analytics";
import { loadAppData } from "../application/load-app-data";
import { httpAppDataRepository } from "../infrastructure/http-app-data-repository";
import {
  calculateSquadOvr,
  findShardCombos,
  formatNumber,
  type AppData,
  type Asset,
  type LatestPlayer,
  type PlayerReview,
  type RankingCard,
  type ShardCombo,
} from "../domain/toolkit";

type ToolTab = "home" | "players" | "rankings" | "shardiq" | "ovr" | "library";

const tabs: { id: ToolTab; label: string; short: string }[] = [
  { id: "home", label: "Tổng quan", short: "HOME" },
  { id: "players", label: "Cầu thủ", short: "PLAY" },
  { id: "rankings", label: "Xếp hạng", short: "TOP" },
  { id: "shardiq", label: "ShardIQ", short: "IQ" },
  { id: "ovr", label: "Tính OVR", short: "OVR" },
  { id: "library", label: "Thư viện", short: "LIB" },
];

const positions = ["ST", "LW", "RW", "CAM", "CM", "CDM", "LM", "RM", "LB", "RB", "CB", "GK"];
const formations = [
  "3-4-1-2", "3-4-2-1", "3-4-3 Diamond", "3-4-3 Flat", "3-5-1-1", "3-5-2",
  "4-1-2-1-2 Narrow", "4-1-2-1-2 Wide", "4-1-3-2", "4-1-4-1", "4-2-1-3 Wide",
  "4-2-2-2", "4-2-3-1 Narrow", "4-2-3-1 Wide", "4-2-4", "4-3-1-2", "4-3-2-1",
  "4-3-3", "4-3-3 Attack", "4-3-3 Defend", "4-3-3 False 9", "4-3-3 Holding",
  "4-4-1-1", "4-4-1-1 Attack", "4-4-2 Flat", "4-4-2 Holding", "4-5-1", "4-5-1 Flat",
  "5-2-1-2", "5-2-2-1", "5-3-2", "5-4-1", "5-4-1 (2)",
];

function ImageOrInitial({ src, name, className = "tool-image" }: { src: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className={`${className} image-fallback`}>{name.trim().slice(0, 2).toUpperCase() || "FC"}</span>;
  }
  return <img className={className} src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />;
}

function EmptyState({ children }: { children: string }) {
  return <div className="tool-empty">{children}</div>;
}

async function copyRedeemCode(
  code: { id: number; code: string },
  source: string,
) {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(code.code);
    trackAnalytics("redeem_code_copy", {
      code_id: code.id,
      source,
      status: "success",
    });
  } catch {
    trackAnalytics("redeem_code_copy", {
      code_id: code.id,
      source,
      status: "failure",
    });
  }
}

function PlayerTile({ player }: { player: LatestPlayer }) {
  return (
    <article className="player-tile">
      <div className="player-art">
        <ImageOrInitial src={player.image} name={player.name} />
        <strong>{player.rating}</strong>
        <span>{player.position}</span>
      </div>
      <div className="player-copy">
        <p>{player.program || "FC Mobile"}</p>
        <h3>{player.name}</h3>
        <small>{[player.club, player.nation].filter(Boolean).join(" · ") || "Player database"}</small>
        <div className="mini-stats">
          {Object.entries(player.stats).slice(0, 6).map(([label, value]) => (
            <span key={label}><b>{value}</b>{label.slice(0, 3).toUpperCase()}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ReviewTile({ review }: { review: PlayerReview }) {
  return (
    <details
      className="review-tile"
      data-analytics-content-type="player_review"
      data-analytics-content-id={review.id}
    >
      <summary>
        <ImageOrInitial src={review.image} name={review.name} />
        <span className="review-copy"><small>{review.event} · {review.position}</small><b>{review.name}</b></span>
        <span className="review-rating">{Math.round(review.rating * 10)}</span>
      </summary>
      <div className="review-detail">
        <div className="review-stats">
          {review.stats.map((stat) => <span key={stat.label}><b>{stat.value}</b>{stat.label}</span>)}
        </div>
        {review.pros && <p><strong>Ưu điểm:</strong> {review.pros}</p>}
        {review.cons && <p><strong>Nhược điểm:</strong> {review.cons}</p>}
        {review.verdict && <p><strong>Đánh giá:</strong> {review.verdict}</p>}
      </div>
    </details>
  );
}

function HomeView({ data, openTab }: { data: AppData; openTab: (tab: ToolTab) => void }) {
  const activeCodes = data.codes.filter((code) => code.active);
  const cardOfWeek = [...data.reviews].sort((left, right) => right.rating - left.rating)[0];
  return (
    <div className="tool-view-stack">
      <section className="tool-hero-card">
        <div>
          <p className="eyebrow">FCMOBILE WEB COMPANION</p>
          <h1>Đội hình tốt hơn, ngay trong trình duyệt.</h1>
          <p>Tra cứu cầu thủ, xếp hạng, tối ưu shard và tính OVR. Không cài đặt, không tài khoản.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => openTab("players")}>Tra cứu cầu thủ</button>
            <button className="button button-secondary" onClick={() => openTab("shardiq")}>Mở ShardIQ</button>
          </div>
        </div>
        <div className="hero-score">
          <span>DATA</span>
          <strong>{data.latestPlayers.length + data.reviews.length}</strong>
          <small>hồ sơ cầu thủ</small>
        </div>
      </section>

      <section className="tool-metric-grid">
        <button onClick={() => openTab("players")}><strong>{data.latestPlayers.length}</strong><span>Cầu thủ</span></button>
        <button onClick={() => openTab("rankings")}><strong>12</strong><span>Vị trí xếp hạng</span></button>
        <button onClick={() => openTab("shardiq")}><strong>{data.shardPlayers.length}</strong><span>Lựa chọn shard</span></button>
        <button onClick={() => openTab("library")}><strong>{activeCodes.length}</strong><span>Mã đang hoạt động</span></button>
      </section>

      <div className="tool-two-columns">
        <section className="tool-panel">
          <div className="tool-panel-head"><div><p className="eyebrow">MỚI NHẤT</p><h2>Review cầu thủ</h2></div><button onClick={() => openTab("players")}>Xem tất cả</button></div>
          <div className="review-list">{data.reviews.slice(0, 5).map((review) => <ReviewTile key={review.id} review={review} />)}</div>
        </section>
        <section className="tool-panel">
          <div className="tool-panel-head"><div><p className="eyebrow">CARD OF THE WEEK</p><h2>Nổi bật tuần này</h2></div></div>
          {cardOfWeek ? (
            <div className="featured-review">
              <ImageOrInitial src={cardOfWeek.image} name={cardOfWeek.name} />
              <div><span>{cardOfWeek.event} · {cardOfWeek.position}</span><h3>{cardOfWeek.name}</h3><p>{cardOfWeek.verdict || cardOfWeek.pros || "Được cộng đồng đánh giá cao."}</p></div>
              <strong>{Math.round(cardOfWeek.rating * 10)}</strong>
            </div>
          ) : <EmptyState>Chưa có review.</EmptyState>}
          <div className="code-preview">
            <h3>Mã quà tặng</h3>
            {activeCodes.slice(0, 4).map((code) => <button key={code.id} onClick={() => void copyRedeemCode(code, "tools_home")}><b>{code.code}</b><span>{code.reward || "Nhấn để sao chép"}</span></button>)}
          </div>
        </section>
      </div>
    </div>
  );
}

function PlayersView({ data }: { data: AppData }) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("ALL");
  const [minimum, setMinimum] = useState(0);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.latestPlayers
      .filter((player) => !normalized || [player.name, player.club, player.nation, player.program].some((value) => value.toLowerCase().includes(normalized)))
      .filter((player) => position === "ALL" || player.position === position)
      .filter((player) => player.rating >= minimum)
      .sort((left, right) => right.rating - left.rating);
  }, [data.latestPlayers, minimum, position, query]);

  useEffect(() => {
    const normalized = query.trim();
    if (!normalized) return;
    const timer = window.setTimeout(() => {
      trackAnalytics("player_search", {
        mode: "query",
        query_length: normalized.length,
        result_count: filtered.length,
        position,
        minimum_ovr: minimum,
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [filtered.length, minimum, position, query]);

  return (
    <div className="tool-view-stack">
      <section className="tool-panel filter-panel">
        <div><p className="eyebrow">PLAYER DATABASE</p><h1>Cầu thủ</h1><p>{filtered.length} kết quả từ snapshot mới nhất.</p></div>
        <div className="filter-row">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên, CLB, quốc gia, chương trình…" />
          <select value={position} onChange={(event) => { const next = event.target.value; setPosition(next); trackAnalytics("player_search", { mode: "filter", filter_name: "position", filter_value: next }); }}><option value="ALL">Mọi vị trí</option>{positions.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={minimum} onChange={(event) => { const next = Number(event.target.value); setMinimum(next); trackAnalytics("player_search", { mode: "filter", filter_name: "minimum_ovr", filter_value: next }); }}><option value="0">Mọi OVR</option><option value="100">OVR 100+</option><option value="110">OVR 110+</option><option value="120">OVR 120+</option></select>
        </div>
      </section>
      <section className="player-grid">{filtered.map((player) => <PlayerTile key={player.id} player={player} />)}</section>
      {!filtered.length && <EmptyState>Không tìm thấy cầu thủ phù hợp.</EmptyState>}
      <section className="tool-panel">
        <div className="tool-panel-head"><div><p className="eyebrow">COMMUNITY</p><h2>Review chuyên sâu</h2></div></div>
        <div className="review-grid">{data.reviews.slice(0, 24).map((review) => <ReviewTile key={review.id} review={review} />)}</div>
      </section>
    </div>
  );
}

function RankingColumn({ title, cards }: { title: string; cards: RankingCard[] }) {
  return (
    <section className="ranking-column">
      <h2>{title}</h2>
      {cards.map((card) => (
        <article key={`${title}-${card.rank}-${card.name}`}>
          <span className="rank-number">#{card.rank}</span>
          <ImageOrInitial src={card.image} name={card.name} />
          <div><h3>{card.name}</h3><p>{card.marketValue || "Chưa có giá"}</p><small>WF {card.weakFoot || "-"} · SM {card.skillMoves || "-"} · STA {card.stamina || "-"}</small></div>
        </article>
      ))}
      {!cards.length && <EmptyState>Chưa có dữ liệu vị trí này.</EmptyState>}
    </section>
  );
}

function RankingsView({ data }: { data: AppData }) {
  const [position, setPosition] = useState("ST");
  const board = data.rankings[position];
  useEffect(() => {
    trackAnalytics("ranking_view", {
      position,
      top_count: board?.top.cards.length ?? 0,
      mid_count: board?.mid.cards.length ?? 0,
      low_count: board?.low.cards.length ?? 0,
    });
  }, [board, position]);
  return (
    <div className="tool-view-stack">
      <section className="tool-panel filter-panel">
        <div><p className="eyebrow">POSITION RANKINGS</p><h1>Xếp hạng cầu thủ</h1><p>Top, tầm trung và tiết kiệm theo từng vị trí.</p></div>
        <div className="position-pills">{positions.map((item) => <button className={position === item ? "active" : ""} key={item} onClick={() => setPosition(item)}>{item}</button>)}</div>
      </section>
      <div className="ranking-grid">
        <RankingColumn title="Top 10" cards={board?.top.cards ?? []} />
        <RankingColumn title="Tầm trung" cards={board?.mid.cards ?? []} />
        <RankingColumn title="Tiết kiệm" cards={board?.low.cards ?? []} />
      </div>
    </div>
  );
}

function ComboCard({ combo, index }: { combo: ShardCombo; index: number }) {
  return (
    <article className="combo-card">
      <header><span>Phương án #{index + 1}</span><strong>{combo.percentage}%</strong></header>
      <div className="combo-players">
        {combo.players.map(({ player, assignedPosition }) => (
          <div key={`${player.id}-${assignedPosition}`}>
            <ImageOrInitial src={player.image} name={player.name} />
            <span><b>{player.name}</b><small>{assignedPosition} · OVR {player.overall}</small></span>
            <strong>{formatNumber(player.shardValue)}</strong>
          </div>
        ))}
      </div>
      <footer><span>Tổng shard</span><b>{formatNumber(combo.totalCost)}</b></footer>
    </article>
  );
}

function ShardView({ data }: { data: AppData }) {
  const [budget, setBudget] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [event, setEvent] = useState("");
  const [combos, setCombos] = useState<ShardCombo[]>([]);
  const events = useMemo(() => [...new Set(data.shardPlayers.map((player) => player.event).filter(Boolean))].sort(), [data.shardPlayers]);
  function toggle(position: string) {
    setSelected((current) => current.includes(position) ? current.filter((item) => item !== position) : current.length < 6 ? [...current, position] : current);
    setCombos([]);
  }
  function calculate() {
    const normalizedBudget = Number(budget.replaceAll(/[^0-9]/g, ""));
    const nextCombos = findShardCombos({ budget: normalizedBudget, positions: selected, players: data.shardPlayers, event: event || undefined });
    setCombos(nextCombos);
    trackAnalytics("shardiq_run", {
      budget: normalizedBudget,
      event_filter: event || "all",
      position_count: selected.length,
      result_count: nextCombos.length,
      status: nextCombos.length ? "success" : "empty",
    });
  }
  return (
    <div className="tool-view-stack">
      <section className="tool-panel shard-form">
        <div><p className="eyebrow">SHARD COMBO OPTIMIZER</p><h1>ShardIQ</h1><p>Tìm tổ hợp cầu thủ chất lượng cao nhất trong ngân sách.</p></div>
        <label>Ngân sách shard<input inputMode="numeric" value={budget} onChange={(e) => { setBudget(e.target.value); setCombos([]); }} placeholder="Ví dụ: 100000" /></label>
        <label>Sự kiện<select value={event} onChange={(e) => { setEvent(e.target.value); setCombos([]); }}><option value="">Mọi sự kiện</option>{events.map((item) => <option key={item}>{item}</option>)}</select></label>
        <div><span className="field-label">Vị trí cần tìm ({selected.length}/6)</span><div className="position-pills">{positions.map((item) => <button className={selected.includes(item) ? "active" : ""} key={item} onClick={() => toggle(item)}>{item}</button>)}</div></div>
        <button className="button button-primary" onClick={calculate} disabled={!budget || !selected.length}>Tìm phương án</button>
      </section>
      <section className="combo-grid">{combos.map((combo, index) => <ComboCard key={`${combo.score}-${combo.totalCost}-${index}`} combo={combo} index={index} />)}</section>
      {budget && selected.length > 0 && combos.length === 0 && <EmptyState>Nhập điều kiện rồi bấm “Tìm phương án”. Nếu không có kết quả, tăng ngân sách hoặc đổi sự kiện.</EmptyState>}
    </div>
  );
}

function OvrView() {
  const [formation, setFormation] = useState("4-3-3");
  const [starters, setStarters] = useState<(number | null)[]>(Array(11).fill(null));
  const [bench, setBench] = useState<(number | null)[]>(Array(7).fill(null));
  const [badges, setBadges] = useState(0);
  const result = calculateSquadOvr({ starters, bench, badgeCount: badges });
  const lastTrackedResult = useRef("");
  useEffect(() => {
    if (result.squadOvr == null) return;
    const signature = JSON.stringify([formation, starters, bench, badges]);
    const timer = window.setTimeout(() => {
      if (lastTrackedResult.current === signature) return;
      lastTrackedResult.current = signature;
      trackAnalytics("ovr_calculate", {
        formation,
        starter_count: starters.filter((value) => value != null).length,
        bench_count: bench.filter((value) => value != null).length,
        badge_count: badges,
        base_ovr: result.base ?? 0,
        squad_ovr: result.squadOvr ?? 0,
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [badges, bench, formation, result.base, result.squadOvr, starters]);
  function setValue(group: "starters" | "bench", index: number, raw: string) {
    const value = raw ? Math.min(150, Math.max(0, Number(raw))) : null;
    const setter = group === "starters" ? setStarters : setBench;
    setter((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  }
  function reset() {
    setStarters(Array(11).fill(null));
    setBench(Array(7).fill(null));
    setBadges(0);
    trackAnalytics("ovr_reset", { formation });
  }
  return (
    <div className="tool-view-stack">
      <section className="ovr-layout">
        <div className="tool-panel">
          <div className="tool-panel-head"><div><p className="eyebrow">SQUAD CALCULATOR</p><h1>Tính OVR đội hình</h1></div><button onClick={reset}>Đặt lại</button></div>
          <label className="formation-select">Sơ đồ<select value={formation} onChange={(e) => setFormation(e.target.value)}>{formations.map((item) => <option key={item}>{item}</option>)}</select></label>
          <h3>Đội hình chính · {formation}</h3>
          <div className="ovr-input-grid">{starters.map((value, index) => <label key={index}><span>{index === 0 ? "GK" : `Vị trí ${index + 1}`}</span><input aria-label={`Starter ${index + 1}`} inputMode="numeric" value={value ?? ""} onChange={(e) => setValue("starters", index, e.target.value)} placeholder="OVR" /></label>)}</div>
          <h3>Dự bị</h3>
          <div className="ovr-input-grid bench">{bench.map((value, index) => <label key={index}><span>Dự bị {index + 1}</span><input aria-label={`Bench ${index + 1}`} inputMode="numeric" value={value ?? ""} onChange={(e) => setValue("bench", index, e.target.value)} placeholder="OVR" /></label>)}</div>
        </div>
        <aside className="ovr-result-card">
          <span>SQUAD OVR</span><strong>{result.squadOvr ?? "—"}</strong><p>Base {result.base ?? "—"} · {result.squadSize} cầu thủ</p>
          <label>Badge bonus<select value={badges} onChange={(e) => setBadges(Number(e.target.value))}>{Array.from({ length: 12 }, (_, index) => <option key={index} value={index}>+{index}</option>)}</select></label>
          <div><span>OVR cần thêm</span><b>{result.playerOvrNeeded ?? "—"}</b></div>
          <div><span>OVR kế tiếp</span><b>{result.squadOvr == null ? "—" : result.squadOvr + 1}</b></div>
        </aside>
      </section>
    </div>
  );
}

function AssetGrid({ items, assetType }: { items: Asset[]; assetType: "player" | "icon" }) {
  return <div className="asset-grid">{items.map((item) => <article key={item.id}><ImageOrInitial src={item.image} name={item.name} /><div><h3>{item.name || "FC Mobile"}</h3><p>{[item.primary, item.secondary].filter(Boolean).join(" · ")}</p></div><a href={item.image} download target="_blank" rel="noreferrer" data-analytics-ignore="true" onClick={() => trackAnalytics("asset_download", { asset_id: item.id, asset_type: assetType })}>Tải</a></article>)}</div>;
}

function LibraryView({ data }: { data: AppData }) {
  const [section, setSection] = useState<"codes" | "cards" | "players" | "icons">("codes");
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
      <section className="tool-panel filter-panel"><div><p className="eyebrow">FC MOBILE LIBRARY</p><h1>Thư viện</h1><p>Mã quà tặng, mẫu thẻ và ảnh render.</p></div><div className="position-pills"><button className={section === "codes" ? "active" : ""} onClick={() => setSection("codes")}>Mã quà tặng</button><button className={section === "cards" ? "active" : ""} onClick={() => setSection("cards")}>Mẫu thẻ</button><button className={section === "players" ? "active" : ""} onClick={() => setSection("players")}>Player renders</button><button className={section === "icons" ? "active" : ""} onClick={() => setSection("icons")}>Icon renders</button></div></section>
      {section === "codes" && <div className="codes-grid">{data.codes.filter((code) => code.active).map((code) => <button key={code.id} onClick={() => void copyRedeemCode(code, "library")}><span>ACTIVE</span><b>{code.code}</b><p>{code.reward || "Phần thưởng FC Mobile"}</p><small>{code.addedDate || "Nhấn để sao chép"}</small></button>)}</div>}
      {section === "cards" && <div className="official-card-grid">{data.cards.map((card) => <article key={card.id}><img src={card.image} alt={card.title} loading="lazy" /><div><b>{card.title}</b><span>{card.type}</span></div></article>)}</div>}
      {section === "players" && <AssetGrid items={data.playerRenders} assetType="player" />}
      {section === "icons" && <AssetGrid items={data.iconRenders} assetType="icon" />}
    </div>
  );
}

export default function ToolsApp() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ToolTab>("home");
  function openTab(tab: ToolTab, source = "tools_home") {
    setActiveTab(tab);
    trackAnalytics("tool_open", { tool: tab, source });
  }
  function retryDataLoad() {
    trackAnalytics("data_load", { status: "retry" });
    location.reload();
  }
  useEffect(() => {
    const controller = new AbortController();
    const startedAt = performance.now();
    loadAppData(httpAppDataRepository, controller.signal)
      .then((payload: AppData) => {
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
  }, []);

  return (
    <main className="tools-shell">
      <nav className="tools-nav" aria-label="Công cụ FCMaddict">
        {tabs.map((tab) => <button className={activeTab === tab.id ? "active" : ""} key={tab.id} onClick={() => openTab(tab.id, "tools_nav")}><span>{tab.short}</span>{tab.label}</button>)}
      </nav>
      <div className="tools-content">
        {!data && !error && <div className="tool-loading"><span /><h1>Đang tải dữ liệu FC Mobile…</h1></div>}
        {error && <div className="tool-error"><h1>Không tải được dữ liệu</h1><p>{error}</p><button className="button button-primary" onClick={retryDataLoad}>Thử lại</button></div>}
        {data && <>
          {activeTab === "home" && <HomeView data={data} openTab={openTab} />}
          {activeTab === "players" && <PlayersView data={data} />}
          {activeTab === "rankings" && <RankingsView data={data} />}
          {activeTab === "shardiq" && <ShardView data={data} />}
          {activeTab === "ovr" && <OvrView />}
          {activeTab === "library" && <LibraryView data={data} />}
          <p className="data-stamp">Dữ liệu đồng bộ: {new Date(data.generatedAt).toLocaleString("vi-VN")}</p>
        </>}
      </div>
    </main>
  );
}
