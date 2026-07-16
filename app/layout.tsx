import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const baseMetadata: Metadata = {
  title: {
    default: "FCMaddict — Trợ lý cầu thủ & đội hình",
    template: "%s",
  },
  description:
    "Bộ công cụ đồng hành giúp theo dõi cầu thủ, bảng xếp hạng, shard và OVR đội hình.",
  applicationName: "FCMaddict",
  icons: {
    icon: "/app-icon.png",
    apple: "/app-icon.png",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "FCMaddict — Trợ lý cầu thủ & đội hình",
    description:
      "Khám phá cầu thủ, tối ưu shard và kiểm tra OVR trong một ứng dụng gọn nhẹ.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${protocol}://${host}/og.png`;

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      images: [{ url: ogImage, width: 1672, height: 941, alt: "FCMaddict" }],
    },
    twitter: {
      ...baseMetadata.twitter,
      images: [ogImage],
    },
  };
}

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
