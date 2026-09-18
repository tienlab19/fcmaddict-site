import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../_components/SiteChrome";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư — FCMaddict",
  description:
    "Cách website FCMaddict xử lý dữ liệu trình duyệt, kết nối mạng và dịch vụ bên thứ ba.",
};

export default function PrivacyPage() {
  return (
    <div className="site-shell">
      <SiteHeader current="privacy" />
      <main className="legal-main">
        <section className="section-wrap legal-hero">
          <p className="eyebrow">PRIVACY POLICY</p>
          <h1>Chính sách quyền riêng tư</h1>
          <p className="legal-intro">
            Chính sách này giải thích cách FCMaddict xử lý thông tin khi bạn sử
            dụng website.
          </p>
          <div className="updated-pill">Cập nhật lần cuối: 18/09/2026</div>
        </section>

        <div className="section-wrap legal-layout">
          <aside className="legal-summary">
            <p className="summary-title">Tóm tắt nhanh</p>
            <ul>
              <li>Không yêu cầu tài khoản</li>
              <li>Không quảng cáo hoặc theo dõi quảng cáo</li>
              <li>Không bán dữ liệu cá nhân</li>
              <li>Không tự truy cập tệp trên thiết bị</li>
              <li>Dữ liệu nhập được xử lý trong trình duyệt khi có thể</li>
            </ul>
          </aside>

          <article className="legal-content">
            <section>
              <h2>1. Phạm vi áp dụng</h2>
              <p>
                Chính sách này áp dụng cho website FCMaddict do Tien Tran phát
                triển. FCMaddict là sản phẩm độc lập dành cho cộng đồng FC Mobile
                và không phải sản phẩm của Electronic Arts Inc.
              </p>
            </section>

            <section>
              <h2>2. Thông tin FCMaddict không yêu cầu</h2>
              <p>
                Website không yêu cầu tạo tài khoản và không trực tiếp yêu cầu
                tên, số điện thoại, địa chỉ, vị trí, danh bạ, camera, microphone
                hoặc thông tin thanh toán. Email chỉ được nhận khi bạn chủ động
                liên hệ hỗ trợ.
              </p>
            </section>

            <section>
              <h2>3. Dữ liệu trong trình duyệt</h2>
              <p>
                Các giá trị bạn nhập vào bộ lọc, ShardIQ hoặc máy tính OVR được
                dùng để tạo kết quả tương ứng. FCMaddict ưu tiên xử lý những dữ
                liệu này trong trình duyệt và không dùng chúng để lập hồ sơ người
                dùng.
              </p>
              <p>
                Nếu website lưu tùy chọn bằng bộ nhớ trình duyệt, bạn có thể xóa
                chúng trong phần cài đặt dữ liệu website của trình duyệt.
              </p>
            </section>

            <section>
              <h2>4. Nội dung và kết nối mạng</h2>
              <p>
                Một số tính năng có thể kết nối tới nguồn nội dung bên thứ ba,
                bao gồm FC Mobile Forum và RenderZ, để tải thông tin cầu thủ, bài
                đánh giá, bảng xếp hạng, mã quà tặng hoặc hình ảnh. Các nhà cung
                cấp này có thể nhận địa chỉ IP, user-agent và thông tin yêu cầu
                theo cơ chế thông thường của Internet.
              </p>
              <p>
                Việc lưu giữ và sử dụng dữ liệu bởi các dịch vụ đó tuân theo
                chính sách riêng của từng nhà cung cấp. FCMaddict không bán dữ
                liệu cá nhân cho các dịch vụ này.
              </p>
            </section>

            <section>
              <h2>5. Hosting và nhật ký kỹ thuật</h2>
              <p>
                Website được phân phối qua dịch vụ hosting và mạng phân phối nội
                dung. Nhà cung cấp hosting có thể xử lý nhật ký kỹ thuật như địa
                chỉ IP, thời gian truy cập, URL và loại trình duyệt để vận hành,
                bảo mật và chẩn đoán sự cố.
              </p>
            </section>

            <section>
              <h2>6. Tệp tải xuống và Clipboard</h2>
              <p>
                Website chỉ tải hình ảnh khi bạn chủ động chọn tải. FCMaddict
                không tự đọc tệp cá nhân trên thiết bị. Khi bạn chọn sao chép mã
                quà tặng, website chỉ ghi nội dung đã chọn vào Clipboard.
              </p>
            </section>

            <section>
              <h2>7. Quảng cáo và theo dõi</h2>
              <p>
                Phiên bản hiện tại không hiển thị quảng cáo và không sử dụng dữ
                liệu để theo dõi bạn giữa các website nhằm phục vụ quảng cáo.
              </p>
            </section>

            <section>
              <h2>8. Lưu giữ và xóa dữ liệu</h2>
              <p>
                FCMaddict không vận hành hệ thống tài khoản người dùng. Bạn có thể
                xóa dữ liệu cục bộ bằng công cụ quản lý dữ liệu website của trình
                duyệt. Dữ liệu kỹ thuật do bên thứ ba xử lý tuân theo thời hạn lưu
                giữ của nhà cung cấp tương ứng.
              </p>
            </section>

            <section>
              <h2>9. Trẻ em</h2>
              <p>
                FCMaddict không được thiết kế để cố ý thu thập thông tin cá nhân
                của trẻ em. Nếu bạn cho rằng trẻ em đã cung cấp thông tin cá nhân,
                vui lòng liên hệ để được hỗ trợ.
              </p>
            </section>

            <section>
              <h2>10. Thay đổi chính sách</h2>
              <p>
                Chính sách có thể được cập nhật khi tính năng hoặc cách xử lý dữ
                liệu thay đổi. Ngày cập nhật mới nhất luôn được hiển thị ở đầu
                trang này.
              </p>
            </section>

            <section className="contact-panel">
              <p className="eyebrow">LIÊN HỆ VỀ QUYỀN RIÊNG TƯ</p>
              <h2>Tien Tran</h2>
              <a href="mailto:tientran99.bka@gmail.com">
                tientran99.bka@gmail.com
              </a>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
