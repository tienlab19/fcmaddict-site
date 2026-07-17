import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./_components/SiteChrome";

export const metadata: Metadata = {
  title: "FCMaddict — Trợ lý cầu thủ & đội hình cho FC Mobile",
  description:
    "FCMaddict là trợ lý FC Mobile all-in-one: tra cứu cầu thủ, xem bảng xếp hạng theo vị trí, tối ưu shard với ShardIQ, tính OVR đội hình và cập nhật mã quà tặng — miễn phí, không tài khoản, không quảng cáo.",
};

const features = [
  {
    code: "01",
    title: "Hồ sơ cầu thủ chi tiết",
    body: "Chỉ số, ưu và nhược điểm, review cộng đồng cùng các thẻ mới nhất — gom về một luồng dễ đọc, luôn cập nhật.",
  },
  {
    code: "TOP",
    title: "Bảng xếp hạng theo vị trí",
    body: "Top 10, lựa chọn tầm trung và phương án tiết kiệm cho từng vị trí, giúp bạn chọn đúng cầu thủ trong tầm ngân sách.",
  },
  {
    code: "IQ",
    title: "Tối ưu shard với ShardIQ",
    body: "Nhập ngân sách shard, chọn vị trí và sự kiện — ShardIQ gợi ý những tổ hợp cầu thủ đáng đầu tư nhất cho bạn.",
  },
  {
    code: "OVR",
    title: "Máy tính OVR đội hình",
    body: "Chọn sơ đồ, nhập OVR đội chính và dự bị để dự đoán OVR toàn đội ngay trên thiết bị, không cần chờ tải mạng.",
  },
  {
    code: "GIFT",
    title: "Mã quà tặng luôn mới",
    body: "Theo dõi mã đang hoạt động, kiểm tra trạng thái còn hạn và sao chép chỉ với một chạm để nhập vào game.",
  },
  {
    code: "IMG",
    title: "Thư viện thẻ & ảnh render",
    body: "Khám phá thẻ cầu thủ và ảnh render chất lượng cao, lưu ảnh yêu thích vào Photos khi bạn chủ động chọn tải.",
  },
];

const steps = [
  {
    code: "1",
    title: "Mở app, không cần đăng nhập",
    body: "Cài đặt và dùng ngay toàn bộ tính năng. Không tài khoản, không email, không bước xác thực rườm rà.",
  },
  {
    code: "2",
    title: "Tra cứu & so sánh",
    body: "Tìm cầu thủ, đọc bảng xếp hạng theo vị trí và dùng ShardIQ để cân nhắc phương án phù hợp ngân sách.",
  },
  {
    code: "3",
    title: "Quyết định đội hình",
    body: "Dùng máy tính OVR để chốt đội hình, lưu mã quà tặng và ảnh render bạn cần — tất cả ở một nơi.",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader current="home" />

      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow">TRỢ LÝ FC MOBILE</p>
            <h1>
              Mọi quyết định đội hình,
              <span> sáng rõ hơn.</span>
            </h1>
            <p className="hero-lead">
              FCMaddict gom mọi công cụ bạn cần cho FC Mobile — tra cứu cầu thủ,
              tối ưu shard và kiểm tra OVR — vào một ứng dụng nhanh, trực quan và
              hoàn toàn miễn phí. Không tài khoản, không quảng cáo.
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
              <span>Miễn phí 100%</span>
              <span>Không quảng cáo</span>
              <span>Không mua trong app</span>
              <span>Tiếng Việt & English</span>
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
            <div><strong>6</strong><span>Công cụ trong 1 app</span></div>
            <div><strong>2</strong><span>Ngôn ngữ Việt & Anh</span></div>
            <div><strong>0đ</strong><span>Chi phí sử dụng</span></div>
            <div><strong>iOS</strong><span>iPhone & iPad</span></div>
          </div>
        </section>

        <section className="section-wrap section-block" id="features">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BỘ CÔNG CỤ TRONG TẦM TAY</p>
              <h2>Mọi thứ để chơi FC Mobile thông minh hơn</h2>
            </div>
            <p>
              Một trải nghiệm thống nhất để đọc dữ liệu, so sánh lựa chọn và đưa
              ra quyết định tốt nhất cho đội hình của bạn.
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

        <section className="section-wrap section-block" id="how">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CÁCH HOẠT ĐỘNG</p>
              <h2>Bắt đầu chỉ trong ba bước</h2>
            </div>
            <p>
              Không cài đặt phức tạp, không đăng ký. Mở app là dùng được ngay
              mọi tính năng.
            </p>
          </div>

          <div className="feature-grid">
            {steps.map((step) => (
              <article className="feature-card" key={step.title}>
                <span className="feature-code">{step.code}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap privacy-callout">
          <div>
            <p className="eyebrow">TÔN TRỌNG QUYỀN RIÊNG TƯ</p>
            <h2>Dữ liệu của bạn ở lại trên máy.</h2>
          </div>
          <div className="callout-copy">
            <p>
              Lựa chọn ngôn ngữ và dữ liệu hỗ trợ được lưu cục bộ, bản dịch xử lý
              ngay trên thiết bị. Quyền Photos chỉ được hỏi khi bạn chủ động lưu
              một hình ảnh.
            </p>
            <Link href="/privacy">Đọc Chính sách quyền riêng tư →</Link>
          </div>
        </section>

        <section className="section-wrap final-cta">
          <p className="eyebrow">FCMaddict</p>
          <h2>Hiểu cầu thủ. Tối ưu đội hình.</h2>
          <p>
            Được xây dựng độc lập cho cộng đồng FC Mobile — miễn phí, gọn nhẹ và
            luôn đặt trải nghiệm của bạn lên trước.
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
