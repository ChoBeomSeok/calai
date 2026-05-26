import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "탄소 발자국 계산기, 운전·여행·식단·전기로 CO₂",
  description: "운전 거리·항공 여행·식단·전기 사용을 넣으면 일·연 CO₂ 배출량이 즉시. 한국 가구 평균과 비교로 직관적 진단.",
  openGraph: {
    title: "탄소 발자국 — 항목별 CO₂",
    description: "운전·여행·식단·전기로 연 CO₂ 배출량 + 평균 비교.",
    url: "https://www.calai.kr/carbon-footprint",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "탄소 발자국 — 항목별 CO₂",
    description: "운전·여행·식단·전기로 연 CO₂ 배출량 + 평균 비교.",
  },
  alternates: { canonical: "https://www.calai.kr/carbon-footprint" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "탄소 발자국 계산기",
  "description": "운전 거리·항공 여행·식단·전기 사용을 넣으면 일·연 CO₂ 배출량이 즉시. 한국 가구 평균과 비교로 직관적 진단.",
  "url": "https://www.calai.kr/carbon-footprint",
  "applicationCategory": "LifestyleApplication",
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
