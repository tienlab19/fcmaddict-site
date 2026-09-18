import { useEffect, useMemo, useState } from "react";
import { trackAnalytics } from "@/features/analytics/application/track-analytics";
import type { AppData, LatestPlayer } from "../../domain/entities";
import { EmptyState } from "../components/EmptyState";
import { ImageOrInitial } from "../components/ImageOrInitial";
import { ModuleModal } from "../components/ModuleModal";
import { positions } from "../tool-options";

function PlayerTile({ player, onOpen }: { player: LatestPlayer; onOpen: () => void }) {
  return (
    <button type="button" className="player-tile" onClick={onOpen}>
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
    </button>
  );
}

function PlayerDetail({ player, onClose }: { player: LatestPlayer; onClose: () => void }) {
  return (
    <ModuleModal title={player.name} onClose={onClose}>
      <div className="module-detail-hero">
        <div className="module-detail-art"><ImageOrInitial src={player.image} name={player.name} /></div>
        <div>
          <p className="eyebrow">LATEST PLAYER</p>
          <h2>{player.name}</h2>
          <p>{player.program || "FC Mobile"} · {player.position}</p>
          <div className="module-detail-badges">
            <span>OVR {player.rating}</span>
            <span>{player.auctionable ? "Có thể giao dịch" : "Không giao dịch"}</span>
          </div>
        </div>
      </div>
      <div className="module-detail-facts">
        <span><small>CLB</small><b>{player.club || "—"}</b></span>
        <span><small>Quốc gia</small><b>{player.nation || "—"}</b></span>
        <span><small>Ngày thêm</small><b>{player.added ? new Date(player.added).toLocaleDateString("vi-VN") : "—"}</b></span>
      </div>
      <div className="module-detail-stats">
        {Object.entries(player.stats).map(([label, value]) => <span key={label}><b>{value}</b>{label}</span>)}
      </div>
    </ModuleModal>
  );
}

export function PlayersModule({ data }: { data: AppData }) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("ALL");
  const [minimum, setMinimum] = useState(0);
  const [program, setProgram] = useState("ALL");
  const [auctionableOnly, setAuctionableOnly] = useState(false);
  const [sort, setSort] = useState<"latest" | "rating">("latest");
  const [visibleCount, setVisibleCount] = useState(24);
  const [selectedPlayer, setSelectedPlayer] = useState<LatestPlayer | null>(null);
  const programs = useMemo(() => [...new Set(data.latestPlayers.map((player) => player.program).filter(Boolean))].sort(), [data.latestPlayers]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.latestPlayers
      .filter((player) => !normalized || [player.name, player.club, player.nation, player.program].some((value) => value.toLowerCase().includes(normalized)))
      .filter((player) => position === "ALL" || player.position === position)
      .filter((player) => player.rating >= minimum)
      .filter((player) => program === "ALL" || player.program === program)
      .filter((player) => !auctionableOnly || player.auctionable)
      .sort((left, right) => sort === "rating"
        ? right.rating - left.rating || right.id - left.id
        : (Date.parse(right.added) || right.id) - (Date.parse(left.added) || left.id));
  }, [auctionableOnly, data.latestPlayers, minimum, position, program, query, sort]);
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
        program,
        auctionable_only: auctionableOnly ? "yes" : "no",
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [auctionableOnly, filtered.length, minimum, position, program, query]);

  return (
    <div className="tool-view-stack">
      <section className="tool-panel filter-panel">
        <div><p className="eyebrow">PLAYER DATABASE</p><h1>Cầu thủ</h1><p>{filtered.length} kết quả từ snapshot mới nhất.</p></div>
        <div className="filter-row player-filter-row">
          <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(24); }} placeholder="Tên, CLB, quốc gia, chương trình…" />
          <select value={position} onChange={(event) => { const next = event.target.value; setPosition(next); setVisibleCount(24); trackAnalytics("player_search", { mode: "filter", filter_name: "position", filter_value: next }); }}><option value="ALL">Mọi vị trí</option>{positions.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={minimum} onChange={(event) => { const next = Number(event.target.value); setMinimum(next); setVisibleCount(24); trackAnalytics("player_search", { mode: "filter", filter_name: "minimum_ovr", filter_value: next }); }}><option value="0">Mọi OVR</option><option value="100">OVR 100+</option><option value="110">OVR 110+</option><option value="120">OVR 120+</option></select>
          <select value={program} onChange={(event) => { setProgram(event.target.value); setVisibleCount(24); }}><option value="ALL">Mọi chương trình</option>{programs.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={sort} onChange={(event) => { setSort(event.target.value as "latest" | "rating"); setVisibleCount(24); }}><option value="latest">Mới thêm</option><option value="rating">OVR cao nhất</option></select>
        </div>
        <label className="tool-checkbox"><input type="checkbox" checked={auctionableOnly} onChange={(event) => { setAuctionableOnly(event.target.checked); setVisibleCount(24); }} /> Chỉ cầu thủ có thể giao dịch</label>
      </section>
      <section className="player-grid">{filtered.slice(0, visibleCount).map((player) => <PlayerTile key={player.id} player={player} onOpen={() => setSelectedPlayer(player)} />)}</section>
      {!filtered.length && <EmptyState>Không tìm thấy cầu thủ phù hợp.</EmptyState>}
      {visibleCount < filtered.length && <button className="button button-secondary load-more-button" onClick={() => setVisibleCount((count) => count + 24)}>Xem thêm cầu thủ</button>}
      {selectedPlayer && <PlayerDetail player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
    </div>
  );
}
