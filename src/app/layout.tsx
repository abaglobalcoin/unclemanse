import type { Metadata } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";
import AnimeNav from "@/components/AnimeNav";
import ConditionalFooter from "@/components/ConditionalFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const gowunDodum = Gowun_Dodum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gowun-dodum",
});

export const metadata: Metadata = {
  title: "엉클만세 | 효과적인 광고 솔루션",
  description: "거울광고, 엘리베이터 광고, 게시판 광고 등 아파트, 오피스텔, 상가에서 효과적인 광고 솔루션을 제공합니다.",
  keywords: ["광고", "거울광고", "엘리베이터광고", "게시판광고", "아파트광고", "엉클만세"],
  openGraph: {
    title: "엉클만세 | 효과적인 광고 솔루션",
    description: "거울광고, 엘리베이터 광고, 게시판 광고 등 효과적인 광고 솔루션을 제공합니다.",
    url: "https://www.unclemanse.com",
    siteName: "엉클만세",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://static.wixstatic.com/media/3a3909_390f49d3a00b433bb99f082df7f5b20f~mv2.png",
        width: 1200,
        height: 630,
        alt: "엉클만세",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${gowunDodum.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <AnimeNav />
        <main className="pt-16">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
