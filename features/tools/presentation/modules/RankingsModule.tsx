import { useEffect, useState } from "react";
import { trackAnalytics } from "@/features/analytics/application/track-analytics";
import type { AppData, RankingCard } from "../../domain/entities";
import { EmptyState } from "../components/EmptyState";
import { ImageOrInitial } from "../components/ImageOrInitial";
import { positions } from "../tool-options";

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

export function RankingsModule({ data }: { data: AppData }) {
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
