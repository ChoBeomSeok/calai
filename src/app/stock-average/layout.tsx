import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주식 평단가 계산기, 추가 매수 후 평균 단가 즉시",
  description: "기존 보유 주식과 추가 매수 수량·가격을 넣으면 새로운 평균 매수 단가가 즉시. 물타기·불타기 전후 손익 시뮬레이션에.",
  openGraph: {
    title: "주식 평단가 — 추가 매수 후 평균",
    description: "기존 보유 + 추가 매수로 평균 단가 자동, 물타기 시뮬레이션.",
    url: "https://calai.kr/stock-average",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "주식 평단가 — 추가 매수 후 평균",
    description: "기존 보유 + 추가 매수로 평균 단가 자동, 물타기 시뮬레이션.",
  },
  alternates: { canonical: "https://calai.kr/stock-average" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "주식 평단가 계산기",
  "description": "기존 보유 주식과 추가 매수 수량·가격을 넣으면 새로운 평균 매수 단가가 즉시. 물타기·불타기 전후 손익 시뮬레이션에.",
  "url": "https://calai.kr/stock-average",
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
