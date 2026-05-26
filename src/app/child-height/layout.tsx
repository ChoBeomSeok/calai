import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자녀 키 예측, 부모 키로 성인 예상 신장",
  description: "아빠·엄마 키와 자녀 성별을 넣으면 Tanner 공식으로 자녀의 예상 성인 신장을 자동 산출. 성장 곡선 참고용.",
  openGraph: {
    title: "자녀 키 예측 — 부모 키 기준",
    description: "Tanner 공식으로 자녀의 예상 성인 키 자동 산출.",
    url: "https://www.calai.kr/child-height",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "자녀 키 예측 — 부모 키 기준",
    description: "Tanner 공식으로 자녀의 예상 성인 키 자동 산출.",
  },
  alternates: { canonical: "https://www.calai.kr/child-height" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "어린이 키 예측",
  "description": "아빠·엄마 키와 자녀 성별을 넣으면 Tanner 공식으로 자녀의 예상 성인 신장을 자동 산출. 성장 곡선 참고용.",
  "url": "https://www.calai.kr/child-height",
  "applicationCategory": "HealthApplication",
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
