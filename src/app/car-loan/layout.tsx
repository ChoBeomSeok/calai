import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자동차 할부 계산기, 월 할부금·총 이자 즉시",
  description: "차량가·계약금·할부 기간·금리를 넣으면 월 할부금과 총 이자가 한눈에. 대출 vs 일시불, 다른 차량과의 부담 비교에.",
  openGraph: {
    title: "자동차 할부 — 월 할부금",
    description: "차량가·계약금·기간·금리로 월 할부금·총 이자 즉시.",
    url: "https://www.calai.kr/car-loan",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "자동차 할부 — 월 할부금",
    description: "차량가·계약금·기간·금리로 월 할부금·총 이자 즉시.",
  },
  alternates: { canonical: "https://www.calai.kr/car-loan" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "자동차 할부 계산기",
  "description": "차량가·계약금·할부 기간·금리를 넣으면 월 할부금과 총 이자가 한눈에. 대출 vs 일시불, 다른 차량과의 부담 비교에.",
  "url": "https://www.calai.kr/car-loan",
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
