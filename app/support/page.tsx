import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../_components/SiteChrome";

export const metadata: Metadata = {
  title: "Hỗ trợ — FCMaddict",
  description:
    "Liên hệ hỗ trợ FCMaddict, xem hướng dẫn xử lý sự cố và câu hỏi thường gặp.",
};

const faqs = [
  {
    question: "Tôi có cần tạo tài khoản không?",
    answer:
      "Không. FCMaddict cho phép truy cập toàn bộ tính năng hiện có mà không cần đăng ký hoặc đăng nhập.",
  },
  {
    question: "Vì sao dữ liệu cầu thủ không tải được?",
    answer:
      "Hãy kiểm tra kết nối Internet, sau đó kéo xuống để làm mới hoặc bấm nút làm mới trên màn hình. Một số nguồn dữ liệu bên thứ ba có thể tạm thời gián đoạn.",
  },
  {
    question: "Ứng dụng có đọc thư viện ảnh của tôi không?",
    answer:
      "Không. Ứng dụng chỉ xin quyền thêm ảnh vào Photos sau khi bạn chủ động bấm Tải. Ứng dụng không đọc hoặc tải ảnh cá nhân lên máy chủ.",
  },
  {
    question: "Làm thế nào để đổi ngôn ngữ?",
    answer:
      "Tại Trang chủ, bấm biểu tượng ngôn ngữ ở phần đầu màn hình và chọn Tiếng Việt hoặc English.",
  },
  {
    question: "Tôi muốn báo cáo hình ảnh hoặc nội dung.",
    answer:
      "Gửi email cho chúng tôi kèm đường dẫn, ảnh chụp màn hình và mô tả nội dung cần xem xét. Các yêu cầu hợp lệ sẽ được kiểm tra sớm nhất có thể.",
  },
];

export default function SupportPage() {
  return (
    <div className="site-shell">
      <SiteHeader current="support" />
      <main className="support-main">
        <section className="section-wrap support-hero">
          <div>
            <p className="eyebrow">SUPPORT CENTER</p>
            <h1>Chúng tôi có thể giúp gì?</h1>
            <p>
              Gửi câu hỏi, báo lỗi hoặc đề xuất tính năng. Hãy kèm thông tin thiết
              bị để chúng tôi hỗ trợ nhanh hơn.
            </p>
          </div>
          <div className="support-contact-card">
            <span className="support-badge">EMAIL SUPPORT</span>
            <h2>Liên hệ trực tiếp</h2>
            <p>Phản hồi thường được gửi trong vòng 3–5 ngày làm việc.</p>
            <a
              className="button button-primary full-width"
              href="mailto:tientran99.bka@gmail.com?subject=FCMaddict%20Support"
            >
              tientran99.bka@gmail.com
            </a>
          </div>
        </section>

        <section className="section-wrap support-grid">
          <div className="support-checklist">
            <p className="eyebrow">TRƯỚC KHI GỬI YÊU CẦU</p>
            <h2>Thông tin nên đính kèm</h2>
            <ol>
              <li><span>01</span><p><b>Thiết bị</b>Ví dụ: iPhone 15 Pro hoặc iPad Pro.</p></li>
              <li><span>02</span><p><b>Phiên bản hệ điều hành</b>Ví dụ: iOS 26.5.</p></li>
              <li><span>03</span><p><b>Phiên bản ứng dụng</b>Hiển thị trong thông tin ứng dụng.</p></li>
              <li><span>04</span><p><b>Mô tả và ảnh chụp</b>Không gửi mật khẩu hoặc thông tin nhạy cảm.</p></li>
            </ol>
          </div>

          <div className="status-card">
            <span className="status-dot" />
            <div>
              <p>DỊCH VỤ HỖ TRỢ</p>
              <h3>Sẵn sàng nhận yêu cầu</h3>
            </div>
          </div>
        </section>

        <section className="section-wrap faq-section">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">CÂU HỎI THƯỜNG GẶP</p>
              <h2>Tìm câu trả lời nhanh</h2>
            </div>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}<span>+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section-wrap support-bottom">
          <div>
            <p className="eyebrow">VẪN CẦN TRỢ GIÚP?</p>
            <h2>Hãy gửi email cho chúng tôi.</h2>
          </div>
          <a
            className="button button-secondary"
            href="mailto:tientran99.bka@gmail.com?subject=FCMaddict%20Support"
          >
            Mở ứng dụng email
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
