import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "칼로리 계산기, BMR·TDEE 한 번에 다이어트 권장량까지",
  description: "기초대사량(BMR)과 일일 소모 칼로리(TDEE)를 즉시 산출. 다이어트·유지·벌크업 목표별 권장 섭취량을 한 페이지에. 가입 없이 무료.",
  openGraph: {
    title: "칼로리 계산 — BMR·TDEE 즉시",
    description: "BMR·TDEE 자동 산출 + 다이어트·유지·벌크업 권장량까지 한눈에.",
    url: "https://calai.kr/calorie",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "칼로리 계산 — BMR·TDEE 즉시",
    description: "BMR·TDEE 자동 산출 + 다이어트·유지·벌크업 권장량까지 한눈에.",
  },
  alternates: { canonical: "https://calai.kr/calorie" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "칼로리 계산기 (BMR·TDEE)",
  "description": "기초대사량(BMR)과 일일 소모 칼로리(TDEE)를 즉시 산출. 다이어트·유지·벌크업 목표별 권장 섭취량을 한 페이지에. 가입 없이 무료.",
  "url": "https://calai.kr/calorie",
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
