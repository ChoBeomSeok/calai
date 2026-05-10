import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "단가 비교 (g당) — calai",
  description: "여러 상품 가격·용량 → g당·100g당·ml당 단가 비교.",
  openGraph: {
    title: "단가 비교 (g당) | calai",
    description: "여러 상품 가격·용량 → g당·100g당·ml당 단가 비교.",
    url: "https://calai.kr/unit-price",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/unit-price" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "단가 비교 (g당)",
  description: "여러 상품 가격·용량 → g당·100g당·ml당 단가 비교.",
  url: "https://calai.kr/unit-price",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
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
