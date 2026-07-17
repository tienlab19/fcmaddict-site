import Image from "next/image";
import Link from "next/link";

type CurrentPage = "home" | "privacy" | "support";

const BASE_PATH =
  process.env.GITHUB_PAGES === "true" ? "/fcmaddict-site" : "";

function BrandMark() {
  return (
    <Image
      className="brand-mark"
      src={`${BASE_PATH}/app-icon.png`}
      alt="Logo FCMaddict"
      width={38}
      height={38}
      priority
    />
  );
}

export function SiteHeader({ current }: { current: CurrentPage }) {
  return (
    <header className="site-header">
      <div className="section-wrap header-inner">
        <Link className="brand" href="/" aria-label="FCMaddict — Trang chủ">
          <BrandMark />
          <span>FCMaddict</span>
        </Link>
        <nav className="site-nav" aria-label="Điều hướng chính">
          <Link aria-current={current === "home" ? "page" : undefined} href="/">
            Giới thiệu
          </Link>
          <Link
            aria-current={current === "privacy" ? "page" : undefined}
            href="/privacy"
          >
            Quyền riêng tư
          </Link>
          <Link
            aria-current={current === "support" ? "page" : undefined}
            href="/support"
          >
            Hỗ trợ
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-grid">
        <div>
          <Link className="brand" href="/">
            <BrandMark />
            <span>FCMaddict</span>
          </Link>
          <p>Trợ lý cầu thủ và đội hình dành cho cộng đồng FC Mobile.</p>
        </div>
        <div className="footer-links">
          <Link href="/">Marketing</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/support">Support</Link>
          <a href="mailto:tientran99.bka@gmail.com">Email</a>
        </div>
      </div>
      <div className="section-wrap footer-legal">
        <span>© 2026 Tien Tran. All rights reserved.</span>
        <span>
          FCMaddict là ứng dụng độc lập, không liên kết hoặc được Electronic Arts
          Inc. xác nhận.
        </span>
      </div>
    </footer>
  );
}
