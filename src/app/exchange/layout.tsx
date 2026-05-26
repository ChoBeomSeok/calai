import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "환율 변환기, 실시간 USD·JPY·EUR·CNY 원화 변환",
  description: "실시간 환율 기반으로 달러·엔·유로·위안 등 주요 통화를 원화로 즉시 변환. 환율 우대 비교용 베이스 데이터로도 활용.",
  openGraph: {
    title: "환율 변환 — 실시간 주요 통화",
    description: "USD·JPY·EUR·CNY 등 주요 통화의 실시간 원화 변환.",
    url: "https://www.calai.kr/exchange",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "환율 변환 — 실시간 주요 통화",
    description: "USD·JPY·EUR·CNY 등 주요 통화의 실시간 원화 변환.",
  },
  alternates: { canonical: "https://www.calai.kr/exchange" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "환율 변환기",
  "description": "실시간 환율 기반으로 달러·엔·유로·위안 등 주요 통화를 원화로 즉시 변환. 환율 우대 비교용 베이스 데이터로도 활용.",
  "url": "https://www.calai.kr/exchange",
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
