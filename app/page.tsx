/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import appData from "@/public/data/app-data.json";
import { SiteFooter, SiteHeader } from "./_components/SiteChrome";

export const metadata: Metadata = {
  title: "FCMaddict — Trợ lý cầu thủ & đội hình cho FC Mobile",
  description:
    "FCMaddict là trợ lý FC Mobile all-in-one: tra cứu cầu thủ, xem bảng xếp hạng theo vị trí, tối ưu shard với ShardIQ, tính OVR đội hình và cập nhật mã quà tặng — miễn phí, không tài khoản, không quảng cáo.",
};

const tools = [
  { code: "PLAY", title: "Cơ sở dữ liệu cầu thủ", body: "Tìm theo tên, vị trí, OVR và chương trình.", href: "/tools?tab=players" },
  { code: "REV", title: "Review cầu thủ", body: "Đánh giá chi tiết, ưu nhược điểm và lựa chọn thay thế.", href: "/tools?tab=reviews" },
  { code: "TOP", title: "Bảng xếp hạng", body: "Top, tầm trung và tiết kiệm cho 12 vị trí.", href: "/tools?tab=rankings" },
  { code: "IQ", title: "ShardIQ", body: "Tối ưu tổ hợp cầu thủ theo ngân sách shard.", href: "/tools?tab=shardiq" },
  { code: "OVR", title: "Máy tính OVR", body: "Tính OVR đội hình chính, dự bị và badge.", href: "/tools?tab=ovr" },
  { code: "IMG", title: "Thư viện hình ảnh", body: "Tải card art, player render và icon render.", href: "/tools?tab=library" },
];

const rankingGroups = [
  { code: "01", title: "Top 10", body: "Những lựa chọn mạnh nhất theo từng vị trí." },
  { code: "MID", title: "Tầm trung", body: "Hiệu năng cân bằng với ngân sách vừa phải." },
  { code: "LOW", title: "Tiết kiệm", body: "Lựa chọn hiệu quả cho đội hình ít coin." },
];

export default function Home() {
  const reviews = appData.reviews.slice(0, 5);
  const activeCode = appData.codes.find((code) => code.active);
  const playerRenders = appData.playerRenders.slice(0, 3);
  const cardArts = appData.cards.slice(0, 3);

  return (
    <div className="site-shell home-dashboard">
      <SiteHeader current="home" />
      <main className="home-main section-wrap">
        <section className="home-intro">
          <div className="home-intro-copy">
            <p className="eyebrow">FC MOBILE COMPANION</p>
            <h1>Mọi công cụ FC Mobile, trong một nơi.</h1>
            <p>
              Mọi quyết định đội hình trở nên rõ ràng hơn với dữ liệu cầu thủ,
              xếp hạng theo vị trí, ShardIQ và máy tính OVR.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/tools" data-analytics-source="home_intro">Mở bộ công cụ</Link>
              <Link className="button button-secondary" href="/support" data-analytics-source="home_intro">Trung tâm hỗ trợ</Link>
            </div>
          </div>
          <div className="home-intro-metrics" aria-label="Dữ liệu FCMaddict">
            <div><strong>{appData.latestPlayers.length + appData.reviews.length}</strong><span>Hồ sơ & review</span></div>
            <div><strong>12</strong><span>Vị trí xếp hạng</span></div>
            <div><strong>{appData.playerRenders.length + appData.iconRenders.length}</strong><span>Ảnh render</span></div>
          </div>
        </section>

        <section className="home-module">
          <div className="home-module-heading">
            <div><p className="eyebrow">MỚI NHẤT</p><h2>Đánh giá cầu thủ</h2></div>
            <Link href="/tools?tab=reviews" data-analytics-source="home_reviews">Xem tất cả</Link>
          </div>
          <div className="home-review-strip">
            {reviews.map((review) => (
              <Link key={review.id} className="home-review-card" href="/tools?tab=reviews" data-analytics-source="home_reviews">
                <div className="home-review-art">
                  <img src={review.image} alt={review.name} loading="lazy" />
                  <span>{Math.round(review.rating * 10)}</span>
                </div>
                <div><small>{review.event} · {review.position}</small><h3>{review.name}</h3><p>WF {review.weakFoot} · SM {review.skillMoves}</p></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-redeem-banner">
          <div>
            <p className="eyebrow">MÃ QUÀ TẶNG FC MOBILE</p>
            <h2>{activeCode?.code ?? "Mã mới sẽ sớm xuất hiện"}</h2>
            <p>{activeCode?.reward ?? "Theo dõi thư viện để không bỏ lỡ phần thưởng mới."}</p>
          </div>
          <Link className="button button-primary" href="/redeem-codes" data-analytics-source="home_redeem">Mở thư viện mã</Link>
        </section>

        <section className="home-module">
          <div className="home-module-heading"><div><p className="eyebrow">BỘ CÔNG CỤ</p><h2>Công cụ & tính năng</h2></div></div>
          <div className="home-tool-grid">
            {tools.map((tool) => (
              <Link key={tool.code} className="home-tool-card" href={tool.href} data-analytics-source={`home_tool_${tool.code.toLowerCase()}`}>
                <span>{tool.code}</span><div><h3>{tool.title}</h3><p>{tool.body}</p></div><b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-module">
          <div className="home-module-heading">
            <div><p className="eyebrow">PLAYER RANKINGS</p><h2>Bảng xếp hạng cầu thủ</h2></div>
            <Link href="/tools?tab=rankings" data-analytics-source="home_rankings">Khám phá 12 vị trí</Link>
          </div>
          <div className="home-ranking-grid">
            {rankingGroups.map((group) => (
              <Link key={group.code} href="/tools?tab=rankings" data-analytics-source="home_rankings">
                <span>{group.code}</span><div><h3>{group.title}</h3><p>{group.body}</p></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-showcase-grid">
          <Link className="home-showcase home-showcase-renders" href="/tools?tab=library" data-analytics-source="home_renders">
            <div className="home-showcase-copy"><p className="eyebrow">PLAYER RENDERS</p><h2>Ảnh cầu thủ chất lượng cao</h2><span>Mở thư viện ↗</span></div>
            <div className="home-render-stack">{playerRenders.map((render) => <img key={render.id} src={render.image} alt={render.name} loading="lazy" />)}</div>
          </Link>
          <Link className="home-showcase home-showcase-cards" href="/tools?tab=library" data-analytics-source="home_cards">
            <div className="home-showcase-copy"><p className="eyebrow">CARD ARTS</p><h2>Mẫu thẻ sự kiện mới nhất</h2><span>Xem card art ↗</span></div>
            <div className="home-card-stack">{cardArts.map((card) => <img key={card.id} src={card.image} alt={card.title} loading="lazy" />)}</div>
          </Link>
        </section>

        <section className="home-privacy-bar">
          <div><p className="eyebrow">QUYỀN RIÊNG TƯ</p><h2>Không tài khoản. Không quảng cáo.</h2></div>
          <p>Dữ liệu nhập vào công cụ được xử lý trong trình duyệt khi có thể.</p>
          <Link href="/privacy" data-analytics-source="home_privacy">Đọc chính sách ↗</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
