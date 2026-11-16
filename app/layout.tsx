import type { Metadata } from "next";
import "./globals.css";
import { siteOrigin } from "@/lib/site-origin";

export const metadata: Metadata = {
  title: { default: "PhoneStore — Chọn đúng chất. Mua đúng giá.", template: "%s | PhoneStore" },
  description: "Khám phá điện thoại và phụ kiện tại PhoneStore. So sánh dễ dàng, lựa chọn thông minh, trải nghiệm mua sắm dành riêng cho bạn.",
  metadataBase: new URL(siteOrigin),
  openGraph: {title:'PhoneStore — Chọn đúng chất. Mua đúng giá.',description:'Điện thoại bạn thích. Mức giá bạn yêu.',locale:'vi_VN',type:'website'},
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
