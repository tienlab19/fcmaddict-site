import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../_components/SiteChrome";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư — FCMaddict",
  description:
    "Cách FCMaddict xử lý dữ liệu, quyền Photos, nội dung mạng và dịch trên thiết bị.",
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
            dụng ứng dụng trên iPhone hoặc iPad.
          </p>
          <div className="updated-pill">Cập nhật lần cuối: 16/07/2026</div>
        </section>

        <div className="section-wrap legal-layout">
          <aside className="legal-summary">
            <p className="summary-title">Tóm tắt nhanh</p>
            <ul>
              <li>Không yêu cầu tài khoản</li>
              <li>Không quảng cáo hoặc theo dõi quảng cáo</li>
              <li>Không có mua hàng trong ứng dụng</li>
              <li>Chỉ thêm ảnh vào Photos khi bạn yêu cầu</li>
              <li>Dịch nội dung được thực hiện trên thiết bị</li>
            </ul>
          </aside>

          <article className="legal-content">
            <section>
              <h2>1. Phạm vi áp dụng</h2>
              <p>
                Chính sách này áp dụng cho ứng dụng FCMaddict do Tien Tran phát
                triển. FCMaddict là ứng dụng độc lập dành cho cộng đồng người
                chơi bóng đá trên di động và không phải sản phẩm của Electronic
                Arts Inc.
              </p>
            </section>

            <section>
              <h2>2. Thông tin FCMaddict không yêu cầu</h2>
              <p>
                Ứng dụng không yêu cầu bạn tạo tài khoản và không trực tiếp yêu
                cầu tên, email, số điện thoại, địa chỉ, vị trí, danh bạ, camera,
                microphone hoặc thông tin thanh toán.
              </p>
            </section>

            <section>
              <h2>3. Dữ liệu được xử lý trên thiết bị</h2>
              <p>FCMaddict có thể lưu hoặc xử lý cục bộ:</p>
              <ul>
                <li>Lựa chọn ngôn ngữ của ứng dụng.</li>
                <li>Bản dịch đã lưu đệm để tránh dịch lại nội dung.</li>
                <li>Dữ liệu nhập vào máy tính OVR và bộ lọc trong phiên sử dụng.</li>
                <li>Từ khóa tìm cầu thủ; từ khóa này được lọc cục bộ.</li>
              </ul>
              <p>
                Những dữ liệu cục bộ này không được FCMaddict gửi đến máy chủ
                của nhà phát triển. Bạn có thể xóa chúng bằng cách gỡ ứng dụng.
              </p>
            </section>

            <section>
              <h2>4. Nội dung và kết nối mạng</h2>
              <p>
                Ứng dụng kết nối tới các dịch vụ nội dung bên thứ ba, bao gồm FC
                Mobile Forum và RenderZ, để tải thông tin cầu thủ, bài đánh giá,
                bảng xếp hạng, mã quà tặng và hình ảnh. Khi có kết nối mạng, các
                nhà cung cấp này có thể nhận địa chỉ IP, loại thiết bị, thông tin
                yêu cầu và user-agent theo cơ chế thông thường của Internet.
              </p>
              <p>
                Việc lưu giữ và sử dụng dữ liệu bởi các dịch vụ đó được điều
                chỉnh bởi chính sách riêng của từng nhà cung cấp. FCMaddict
                không bán dữ liệu cá nhân cho các dịch vụ này.
              </p>
            </section>

            <section>
              <h2>5. Google ML Kit Translation</h2>
              <p>
                FCMaddict sử dụng Google ML Kit để tải model ngôn ngữ và dịch
                nội dung động trên thiết bị. Theo khai báo quyền riêng tư của
                SDK, ML Kit có thể xử lý mã định danh thiết bị, tương tác sản
                phẩm, dữ liệu hiệu năng, dữ liệu chẩn đoán, nội dung khác và các
                loại dữ liệu kỹ thuật khác cho mục đích phân tích và vận hành
                tính năng. Các dữ liệu này được khai báo là không liên kết với
                danh tính và không dùng để theo dõi quảng cáo.
              </p>
            </section>

            <section>
              <h2>6. Quyền Photos và Clipboard</h2>
              <p>
                Khi bạn bấm tải ảnh, ứng dụng xin quyền chỉ thêm ảnh vào Photos.
                FCMaddict không đọc, duyệt hoặc tải thư viện ảnh cá nhân lên máy
                chủ. Khi bạn bấm sao chép mã quà tặng, ứng dụng chỉ ghi mã đó vào
                Clipboard và không đọc nội dung Clipboard hiện có.
              </p>
            </section>

            <section>
              <h2>7. Quảng cáo, mua hàng và theo dõi</h2>
              <p>
                Phiên bản hiện tại không hiển thị quảng cáo, không có mua hàng
                trong ứng dụng và không sử dụng dữ liệu để theo dõi bạn giữa các
                ứng dụng hoặc website nhằm phục vụ quảng cáo.
              </p>
            </section>

            <section>
              <h2>8. Lưu giữ và xóa dữ liệu</h2>
              <p>
                FCMaddict không vận hành hệ thống tài khoản người dùng. Dữ liệu
                cục bộ có thể được xóa bằng cách gỡ ứng dụng. Đối với dữ liệu kỹ
                thuật do dịch vụ bên thứ ba xử lý, thời hạn lưu giữ tuân theo
                chính sách của nhà cung cấp tương ứng. Bạn có thể gửi yêu cầu
                liên quan đến quyền riêng tư qua email bên dưới.
              </p>
            </section>

            <section>
              <h2>9. Trẻ em</h2>
              <p>
                FCMaddict không được thiết kế để cố ý thu thập thông tin cá nhân
                của trẻ em. Nếu bạn cho rằng trẻ em đã cung cấp thông tin cá
                nhân cho chúng tôi, vui lòng liên hệ để được hỗ trợ.
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
