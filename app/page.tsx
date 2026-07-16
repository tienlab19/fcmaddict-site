import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./_components/SiteChrome";

export const metadata: Metadata = {
  title: "FCMaddict — Trợ lý cầu thủ & đội hình",
  description:
    "Theo dõi cầu thủ, bảng xếp hạng, tối ưu shard, tính OVR và cập nhật mã quà tặng trong một ứng dụng gọn nhẹ.",
};

const features = [
  {
    code: "01",
    title: "Thông tin cầu thủ",
    body: "Xem review, chỉ số, ưu điểm và các thẻ cầu thủ mới nhất trong một luồng thông tin dễ theo dõi.",
  },
  {
    code: "TOP",
    title: "Bảng xếp hạng theo vị trí",
    body: "So sánh Top 10, lựa chọn tầm trung và lựa chọn tiết kiệm cho từng vị trí trong đội hình.",
  },
  {
    code: "IQ",
    title: "Tối ưu ShardIQ",
    body: "Nhập ngân sách shard, chọn vị trí và sự kiện để tìm những tổ hợp cầu thủ phù hợp nhất.",
  },
  {
    code: "OVR",
    title: "Máy tính đội hình",
    body: "Chọn sơ đồ, nhập OVR của đội hình chính và dự bị để dự đoán OVR toàn đội ngay trên thiết bị.",
  },
  {
    code: "GIFT",
    title: "Mã quà tặng",
    body: "Theo dõi mã đang hoạt động, kiểm tra trạng thái và sao chép nhanh để sử dụng khi cần.",
  },
  {
    code: "IMG",
    title: "Thư viện hình ảnh",
    body: "Khám phá thẻ và ảnh render, sau đó chủ động lưu hình ảnh yêu thích vào Photos.",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader current="home" />

      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow">FC MOBILE COMPANION</p>
            <h1>
              Mọi quyết định đội hình,
              <span> sáng rõ hơn.</span>
            </h1>
            <p className="hero-lead">
              FCMaddict gom những công cụ bạn cần để khám phá cầu thủ, tối ưu
              shard và kiểm tra OVR — nhanh, trực quan và không cần tài khoản.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#features">
                Khám phá tính năng
              </a>
              <Link className="button button-secondary" href="/support">
                Trung tâm hỗ trợ
              </Link>
            </div>
            <div className="trust-row" aria-label="Thông tin nhanh">
              <span>Không quảng cáo</span>
              <span>Không mua trong app</span>
              <span>Việt Nam & English</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Tổng quan FCMaddict">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="score-card score-card-main">
              <div className="score-card-top">
                <span className="score-label">SQUAD OVR</span>
                <span className="live-dot">LIVE</span>
              </div>
              <strong>113</strong>
              <div className="score-progress">
                <span />
              </div>
              <div className="score-grid">
                <span>Đội chính<br /><b>111</b></span>
                <span>Dự bị<br /><b>109</b></span>
                <span>Bonus<br /><b>+2</b></span>
              </div>
            </div>
            <div className="floating-card floating-card-top">
              <span className="mini-icon">IQ</span>
              <span><b>ShardIQ</b><small>Tổ hợp tối ưu</small></span>
            </div>
            <div className="floating-card floating-card-bottom">
              <span className="mini-icon green">#1</span>
              <span><b>Xếp hạng</b><small>Cập nhật theo vị trí</small></span>
            </div>
          </div>
        </section>

        <section className="stats-band" aria-label="Điểm nổi bật">
          <div className="section-wrap stats-grid">
            <div><strong>4</strong><span>Công cụ chính</span></div>
            <div><strong>2</strong><span>Ngôn ngữ</span></div>
            <div><strong>0</strong><span>Tài khoản bắt buộc</span></div>
            <div><strong>1</strong><span>Nơi cho mọi dữ liệu</span></div>
          </div>
        </section>

        <section className="section-wrap section-block" id="features">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BỘ CÔNG CỤ TRONG TẦM TAY</p>
              <h2>Tập trung vào điều quan trọng nhất</h2>
            </div>
            <p>
              Một trải nghiệm thống nhất để đọc dữ liệu, so sánh lựa chọn và
              đưa ra quyết định cho đội hình của bạn.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-code">{feature.code}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap privacy-callout">
          <div>
            <p className="eyebrow">ĐƠN GIẢN TỪ THIẾT KẾ</p>
            <h2>Không cần đăng nhập để bắt đầu.</h2>
          </div>
          <div className="callout-copy">
            <p>
              Lựa chọn ngôn ngữ và dữ liệu hỗ trợ được lưu cục bộ. Quyền Photos
              chỉ được hỏi khi bạn chủ động lưu một hình ảnh.
            </p>
            <Link href="/privacy">Đọc Chính sách quyền riêng tư →</Link>
          </div>
        </section>

        <section className="section-wrap final-cta">
          <p className="eyebrow">FCMaddict</p>
          <h2>Hiểu cầu thủ. Tối ưu đội hình.</h2>
          <p>
            Được xây dựng độc lập cho cộng đồng yêu thích bóng đá trên di động.
          </p>
          <div className="hero-actions centered">
            <Link className="button button-primary" href="/support">
              Liên hệ hỗ trợ
            </Link>
            <Link className="button button-secondary" href="/privacy">
              Quyền riêng tư
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
