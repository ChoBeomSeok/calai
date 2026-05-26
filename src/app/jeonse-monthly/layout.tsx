import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전월세 전환 계산기, 전세보증금 ↔ 월세 양방향",
  description: "전세보증금을 월세(보증금+월세)로, 또는 반대로 환산. 법정 전환율 기준으로 집주인 협상 전 실제 손익 가늠.",
  openGraph: {
    title: "전월세 전환 — 보증금↔월세",
    description: "전세 ↔ 월세 양방향 환산, 법정 전환율 반영해 협상에 활용.",
    url: "https://www.calai.kr/jeonse-monthly",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "전월세 전환 — 보증금↔월세",
    description: "전세 ↔ 월세 양방향 환산, 법정 전환율 반영해 협상에 활용.",
  },
  alternates: { canonical: "https://www.calai.kr/jeonse-monthly" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "전월세 전환 계산기",
  "description": "전세보증금을 월세(보증금+월세)로, 또는 반대로 환산. 법정 전환율 기준으로 집주인 협상 전 실제 손익 가늠.",
  "url": "https://www.calai.kr/jeonse-monthly",
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
