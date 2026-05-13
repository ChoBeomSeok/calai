import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "탄소 발자국 계산기 — calai",
  description: "운전·여행·식단·전기로 일·연 CO₂ 배출량 추정.",
  openGraph: {
    title: "탄소 발자국 계산기 | calai",
    description: "운전·여행·식단·전기로 일·연 CO₂ 배출량 추정.",
    url: "https://calai.kr/carbon-footprint",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/carbon-footprint" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "탄소 발자국 계산기",
  description: "운전·여행·식단·전기로 일·연 CO₂ 배출량 추정.",
  url: "https://calai.kr/carbon-footprint",
  applicationCategory: "LifestyleApplication",
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
