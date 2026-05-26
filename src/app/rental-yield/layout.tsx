import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "임대수익률 계산기, 보증금·월세로 연 수익률 즉시",
  description: "매매가·보증금·월세를 넣으면 연 임대수익률(%)이 즉시. 매수 검토 시 다른 매물과의 수익률 비교가 직관적으로 가능.",
  openGraph: {
    title: "임대수익률 — 매물 비교 직관",
    description: "매매가·보증금·월세로 연 임대수익률 자동, 매물 비교용.",
    url: "https://www.calai.kr/rental-yield",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "임대수익률 — 매물 비교 직관",
    description: "매매가·보증금·월세로 연 임대수익률 자동, 매물 비교용.",
  },
  alternates: { canonical: "https://www.calai.kr/rental-yield" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "임대수익률 계산기",
  "description": "매매가·보증금·월세를 넣으면 연 임대수익률(%)이 즉시. 매수 검토 시 다른 매물과의 수익률 비교가 직관적으로 가능.",
  "url": "https://www.calai.kr/rental-yield",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "inLanguage": "ko",
  "isAccessibleForFree": true
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
