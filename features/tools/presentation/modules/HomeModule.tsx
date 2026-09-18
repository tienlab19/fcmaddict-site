import type { AppData, PlayerReview } from "../../domain/entities";
import { copyRedeemCode } from "../copy-redeem-code";
import { EmptyState } from "../components/EmptyState";
import { ImageOrInitial } from "../components/ImageOrInitial";
import type { ToolTab } from "../tools-navigation";

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

export function HomeModule({ data, openTab }: { data: AppData; openTab: (tab: ToolTab) => void }) {
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
          <div className="tool-panel-head"><div><p className="eyebrow">MỚI NHẤT</p><h2>Review cầu thủ</h2></div><button onClick={() => openTab("reviews")}>Xem tất cả</button></div>
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
