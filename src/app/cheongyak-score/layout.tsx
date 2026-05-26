import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "청약 가점 계산기, 무주택·부양·통장 기간 자동 합산",
  description: "무주택 기간·부양가족·청약통장 가입 기간을 넣으면 총 84점 기준 청약 가점이 즉시. 청약 도전 전 객관적 점수 파악.",
  openGraph: {
    title: "청약 가점 — 총 84점 자동",
    description: "무주택·부양·통장 기간으로 청약 가점 84점 만점 자동 합산.",
    url: "https://www.calai.kr/cheongyak-score",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "청약 가점 — 총 84점 자동",
    description: "무주택·부양·통장 기간으로 청약 가점 84점 만점 자동 합산.",
  },
  alternates: { canonical: "https://www.calai.kr/cheongyak-score" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "청약 가점 계산기",
  "description": "무주택 기간·부양가족·청약통장 가입 기간을 넣으면 총 84점 기준 청약 가점이 즉시. 청약 도전 전 객관적 점수 파악.",
  "url": "https://www.calai.kr/cheongyak-score",
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
