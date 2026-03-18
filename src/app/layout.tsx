import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "라이나 인사이트 — Generative UI Demo",
  description: "보험 특약 비교 AI · Generative UI 데모",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  );
}
