import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전기요금 계산기, 누진제 반영해 월 청구액 정확히",
  description: "월 사용량(kWh)만 넣으면 주택용 누진제 3단계가 반영된 월 전기요금이 즉시. 여름철 에어컨 가동 시 요금 시뮬레이션에.",
  openGraph: {
    title: "전기요금 — 누진제 자동",
    description: "월 사용량 입력으로 주택용 누진 3단계 반영 요금 즉시.",
    url: "https://calai.kr/electricity",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "전기요금 — 누진제 자동",
    description: "월 사용량 입력으로 주택용 누진 3단계 반영 요금 즉시.",
  },
  alternates: { canonical: "https://calai.kr/electricity" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "전기요금 계산기",
  "description": "월 사용량(kWh)만 넣으면 주택용 누진제 3단계가 반영된 월 전기요금이 즉시. 여름철 에어컨 가동 시 요금 시뮬레이션에.",
  "url": "https://calai.kr/electricity",
  "applicationCategory": "UtilitiesApplication",
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
