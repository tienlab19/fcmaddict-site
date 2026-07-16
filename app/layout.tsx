import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://tienlab19.github.io/FCMaddict";
const ogImage = `${siteUrl}/og.png`;
const appIcon = `${siteUrl}/app-icon.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FCMaddict — Trợ lý cầu thủ & đội hình",
    template: "%s",
  },
  description:
    "Bộ công cụ đồng hành giúp theo dõi cầu thủ, bảng xếp hạng, shard và OVR đội hình.",
  applicationName: "FCMaddict",
  icons: {
    icon: appIcon,
    apple: appIcon,
  },
  keywords: [
    "cầu thủ",
    "bóng đá",
    "xếp hạng",
    "đội hình",
    "OVR",
    "shard",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "FCMaddict",
    title: "FCMaddict — Mọi quyết định đội hình, sáng rõ hơn",
    description:
      "Khám phá cầu thủ, tối ưu shard và kiểm tra OVR trong một ứng dụng gọn nhẹ.",
    images: [{ url: ogImage, width: 1672, height: 941, alt: "FCMaddict" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FCMaddict — Trợ lý cầu thủ & đội hình",
    description:
      "Khám phá cầu thủ, tối ưu shard và kiểm tra OVR trong một ứng dụng gọn nhẹ.",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
