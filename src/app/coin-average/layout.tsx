import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "코인 평단가 계산기, 추가 매수 후 평균 매수가",
  description: "기존 보유 코인 수량·평단과 추가 매수 정보를 넣으면 새 평균 매수가가 즉시. 비트코인·이더리움 등 모든 코인 공통.",
  openGraph: {
    title: "코인 평단가 — 추가 매수 후 평균",
    description: "보유 + 추가 매수로 코인 평균 매수가 자동 산출.",
    url: "https://www.calai.kr/coin-average",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "코인 평단가 — 추가 매수 후 평균",
    description: "보유 + 추가 매수로 코인 평균 매수가 자동 산출.",
  },
  alternates: { canonical: "https://www.calai.kr/coin-average" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "가상화폐 평단가",
  "description": "기존 보유 코인 수량·평단과 추가 매수 정보를 넣으면 새 평균 매수가가 즉시. 비트코인·이더리움 등 모든 코인 공통.",
  "url": "https://www.calai.kr/coin-average",
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
