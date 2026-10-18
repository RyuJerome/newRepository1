// 모든 화면의 공통 틀: 한국어 글꼴 · 모바일 기준 폭 틀 안에 각 화면을 넣는다
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "요금제 추천·구독",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-bg-surface text-text-primary">
        {/* 앱 전체를 모바일 기준 폭 틀에 넣어 가운데 정렬 (넓은 화면에서도 기준 폭을 넘지 않음) */}
        <div className="app-frame flex flex-col">{children}</div>
      </body>
    </html>
  );
}
