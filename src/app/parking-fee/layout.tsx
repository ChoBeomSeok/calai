import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주차 요금 계산기, 기본·추가·할인까지 정확히",
  description: "기본 요금·추가 단위·할인 조건을 넣으면 총 주차비가 즉시. 백화점·병원·관공서·일반 유료주차장 모두 대응.",
  openGraph: {
    title: "주차 요금 — 기본·추가·할인",
    description: "주차 요금 기본·단위·할인 반영해 실 부담액 즉시.",
    url: "https://www.calai.kr/parking-fee",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "주차 요금 — 기본·추가·할인",
    description: "주차 요금 기본·단위·할인 반영해 실 부담액 즉시.",
  },
  alternates: { canonical: "https://www.calai.kr/parking-fee" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "주차 요금 계산기",
  "description": "기본 요금·추가 단위·할인 조건을 넣으면 총 주차비가 즉시. 백화점·병원·관공서·일반 유료주차장 모두 대응.",
  "url": "https://www.calai.kr/parking-fee",
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
