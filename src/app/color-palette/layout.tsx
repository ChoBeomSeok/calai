import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "컬러 팔레트 생성기 — calai",
  description: "기준 색에서 5색 조화 (보색·유사·삼각·사각) 자동 생성.",
  openGraph: {
    title: "컬러 팔레트 생성기 | calai",
    description: "기준 색에서 5색 조화 (보색·유사·삼각·사각) 자동 생성.",
    url: "https://calai.kr/color-palette",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/color-palette" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "컬러 팔레트 생성기",
  description: "기준 색에서 5색 조화 (보색·유사·삼각·사각) 자동 생성.",
  url: "https://calai.kr/color-palette",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
