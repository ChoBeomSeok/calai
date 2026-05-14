import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자동차세 계산기, 배기량·연식 경감까지 한 번에",
  description: "배기량·연식·승용/화물 구분으로 자동차세를 즉시. 3년 이상 차량 차령 경감과 지방교육세까지 합산해 실 납부액 표시.",
  openGraph: {
    title: "자동차세 — 차령 경감까지",
    description: "배기량·연식 반영한 자동차세 실 납부액 즉시.",
    url: "https://calai.kr/car-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "자동차세 — 차령 경감까지",
    description: "배기량·연식 반영한 자동차세 실 납부액 즉시.",
  },
  alternates: { canonical: "https://calai.kr/car-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "자동차세 계산기",
  "description": "배기량·연식·승용/화물 구분으로 자동차세를 즉시. 3년 이상 차량 차령 경감과 지방교육세까지 합산해 실 납부액 표시.",
  "url": "https://calai.kr/car-tax",
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
