import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자동차 할부 계산기 — calai",
  description: "차량 가격·계약금·할부 기간으로 월 할부금.",
  openGraph: {
    title: "자동차 할부 계산기 | calai",
    description: "차량 가격·계약금·할부 기간으로 월 할부금.",
    url: "https://calai.kr/car-loan",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/car-loan" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "자동차 할부 계산기",
  description: "차량 가격·계약금·할부 기간으로 월 할부금.",
  url: "https://calai.kr/car-loan",
  applicationCategory: "BusinessApplication",
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
