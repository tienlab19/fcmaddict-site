import { useMemo, useState } from "react";
import { trackAnalytics } from "@/features/analytics/application/track-analytics";
import { findShardCombos } from "../../application/find-shard-combos";
import type { AppData, ShardCombo } from "../../domain/entities";
import { EmptyState } from "../components/EmptyState";
import { ImageOrInitial } from "../components/ImageOrInitial";
import { formatNumber } from "../format-number";
import { positions } from "../tool-options";

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

export function ShardIqModule({ data }: { data: AppData }) {
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
        <label>Ngân sách shard<input inputMode="numeric" value={budget} onChange={(event) => { setBudget(event.target.value); setCombos([]); }} placeholder="Ví dụ: 100000" /></label>
        <label>Sự kiện<select value={event} onChange={(change) => { setEvent(change.target.value); setCombos([]); }}><option value="">Mọi sự kiện</option>{events.map((item) => <option key={item}>{item}</option>)}</select></label>
        <div><span className="field-label">Vị trí cần tìm ({selected.length}/6)</span><div className="position-pills">{positions.map((item) => <button className={selected.includes(item) ? "active" : ""} key={item} onClick={() => toggle(item)}>{item}</button>)}</div></div>
        <button className="button button-primary" onClick={calculate} disabled={!budget || !selected.length}>Tìm phương án</button>
      </section>
      <section className="combo-grid">{combos.map((combo, index) => <ComboCard key={`${combo.score}-${combo.totalCost}-${index}`} combo={combo} index={index} />)}</section>
      {budget && selected.length > 0 && combos.length === 0 && <EmptyState>Nhập điều kiện rồi bấm “Tìm phương án”. Nếu không có kết quả, tăng ngân sách hoặc đổi sự kiện.</EmptyState>}
    </div>
  );
}
