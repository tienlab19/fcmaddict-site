/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import type { AppData, PlayerReview } from "../../domain/entities";
import { EmptyState } from "../components/EmptyState";
import { ImageOrInitial } from "../components/ImageOrInitial";
import { ModuleModal } from "../components/ModuleModal";
import { positions } from "../tool-options";

function ReviewCard({ review, onOpen }: { review: PlayerReview; onOpen: () => void }) {
  return (
    <button type="button" className="review-card" onClick={onOpen}>
      <ImageOrInitial src={review.image} name={review.name} />
      <span className="review-copy"><small>{review.event} · {review.position}</small><b>{review.name}</b><em>WF {review.weakFoot || "—"} · SM {review.skillMoves || "—"}</em></span>
      <span className="review-rating">{review.rating.toFixed(1)}</span>
    </button>
  );
}

function ReviewDetail({ review, onClose }: { review: PlayerReview; onClose: () => void }) {
  const skillPoints = review.skillPoints ?? [];
  const playstyles = review.playstyles ?? [];
  const alternatives = review.alternatives ?? [];
  return (
    <ModuleModal title={`Review ${review.name}`} onClose={onClose}>
      <div className="module-detail-hero review-detail-hero">
        <div className="module-detail-art"><ImageOrInitial src={review.image} name={review.name} /></div>
        <div>
          <p className="eyebrow">PLAYER REVIEW</p>
          <h2>{review.name}</h2>
          <p>{review.event} · {review.position}</p>
          <div className="module-detail-badges"><span>Rating {review.rating.toFixed(1)}/10</span><span>WF {review.weakFoot || "—"} · SM {review.skillMoves || "—"}</span><span>STA {review.stamina || "—"}</span></div>
        </div>
      </div>
      <div className="module-detail-stats">
        {review.stats.map((stat) => <span key={stat.label}><b>{stat.value}</b>{stat.label}</span>)}
      </div>
      {(skillPoints.length > 0 || playstyles.length > 0) && <div className="module-detail-section"><h3>Skill points & playstyles</h3><div className="module-detail-tags">{[...skillPoints, ...playstyles].map((item) => <span key={item}>{item}</span>)}</div></div>}
      {review.pros && <div className="module-detail-section positive"><h3>Ưu điểm</h3><p>{review.pros}</p></div>}
      {review.cons && <div className="module-detail-section negative"><h3>Nhược điểm</h3><p>{review.cons}</p></div>}
      {review.verdict && <div className="module-detail-section"><h3>Đánh giá cuối</h3><p>{review.verdict}</p></div>}
      {alternatives.length > 0 && <div className="module-detail-section"><h3>Lựa chọn thay thế</h3><div className="review-alternatives">{alternatives.map((image) => <img key={image} src={image} alt="Lựa chọn thay thế" loading="lazy" />)}</div></div>}
      {(review.author || review.createdDate) && <p className="module-detail-credit">{review.author ? `Review bởi ${review.author}` : ""}{review.author && review.createdDate ? " · " : ""}{review.createdDate || ""}</p>}
    </ModuleModal>
  );
}

export function ReviewsModule({ data }: { data: AppData }) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("ALL");
  const [event, setEvent] = useState("ALL");
  const [rating, setRating] = useState(0);
  const [weakFoot, setWeakFoot] = useState("ALL");
  const [skillMove, setSkillMove] = useState("ALL");
  const [playstyle, setPlaystyle] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(24);
  const [selectedReview, setSelectedReview] = useState<PlayerReview | null>(null);
  const events = useMemo(() => [...new Set(data.reviews.map((review) => review.event).filter(Boolean))].sort(), [data.reviews]);
  const playstyles = useMemo(() => [...new Set(data.reviews.flatMap((review) => review.playstyles ?? []).filter(Boolean))].sort(), [data.reviews]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.reviews.filter((review) => {
      const matchesQuery = !normalized || [review.name, review.event, review.position].some((value) => value.toLowerCase().includes(normalized));
      return matchesQuery
        && (position === "ALL" || review.position === position)
        && (event === "ALL" || review.event === event)
        && review.rating >= rating
        && (weakFoot === "ALL" || review.weakFoot === weakFoot)
        && (skillMove === "ALL" || review.skillMoves === skillMove)
        && (playstyle === "ALL" || (review.playstyles ?? []).includes(playstyle));
    });
  }, [data.reviews, event, playstyle, position, query, rating, skillMove, weakFoot]);
  return (
    <div className="tool-view-stack">
      <section className="tool-panel filter-panel">
        <div><p className="eyebrow">COMMUNITY REVIEWS</p><h1>Review cầu thủ</h1><p>{filtered.length} bài review phù hợp.</p></div>
        <div className="review-filter-grid">
          <input value={query} onChange={(change) => { setQuery(change.target.value); setVisibleCount(24); }} placeholder="Tên cầu thủ, sự kiện…" />
          <select value={position} onChange={(change) => { setPosition(change.target.value); setVisibleCount(24); }}><option value="ALL">Mọi vị trí</option>{positions.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={event} onChange={(change) => { setEvent(change.target.value); setVisibleCount(24); }}><option value="ALL">Mọi sự kiện</option>{events.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={rating} onChange={(change) => { setRating(Number(change.target.value)); setVisibleCount(24); }}><option value="0">Mọi rating</option><option value="8">8.0+</option><option value="8.5">8.5+</option><option value="9">9.0+</option><option value="9.5">9.5+</option></select>
          <select value={weakFoot} onChange={(change) => { setWeakFoot(change.target.value); setVisibleCount(24); }}><option value="ALL">Mọi weak foot</option>{["3", "4", "5"].map((item) => <option key={item} value={item}>WF {item}</option>)}</select>
          <select value={skillMove} onChange={(change) => { setSkillMove(change.target.value); setVisibleCount(24); }}><option value="ALL">Mọi skill move</option>{["3", "4", "5"].map((item) => <option key={item} value={item}>SM {item}</option>)}</select>
          {playstyles.length > 0 && <select value={playstyle} onChange={(change) => { setPlaystyle(change.target.value); setVisibleCount(24); }}><option value="ALL">Mọi playstyle</option>{playstyles.map((item) => <option key={item}>{item}</option>)}</select>}
        </div>
      </section>
      <section className="review-cards-grid">{filtered.slice(0, visibleCount).map((review) => <ReviewCard key={review.id} review={review} onOpen={() => setSelectedReview(review)} />)}</section>
      {!filtered.length && <EmptyState>Không tìm thấy review phù hợp.</EmptyState>}
      {visibleCount < filtered.length && <button className="button button-secondary load-more-button" onClick={() => setVisibleCount((count) => count + 24)}>Xem thêm review</button>}
      {selectedReview && <ReviewDetail review={selectedReview} onClose={() => setSelectedReview(null)} />}
    </div>
  );
}
