import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "g당 단가 비교, 용량 다른 상품도 한눈에",
  description: "여러 상품의 가격과 용량을 넣으면 g당·100g당·ml당 단가가 자동. 대용량이 진짜 싼지, 묶음이 이득인지 명확히.",
  openGraph: {
    title: "g당 단가 — 묶음 vs 단품",
    description: "가격·용량 입력으로 g당·100g당·ml당 단가 자동 비교.",
    url: "https://www.calai.kr/unit-price",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "g당 단가 — 묶음 vs 단품",
    description: "가격·용량 입력으로 g당·100g당·ml당 단가 자동 비교.",
  },
  alternates: { canonical: "https://www.calai.kr/unit-price" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "단가 비교 (g당)",
  "description": "여러 상품의 가격과 용량을 넣으면 g당·100g당·ml당 단가가 자동. 대용량이 진짜 싼지, 묶음이 이득인지 명확히.",
  "url": "https://www.calai.kr/unit-price",
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
