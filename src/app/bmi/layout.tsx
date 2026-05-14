import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI 계산기, 키·체중 입력만으로 비만도 즉시 진단",
  description: "키·체중 두 칸이면 BMI 지수와 비만 단계가 한 번에. 한국 비만학회 + WHO 기준을 나란히 비교, 표준체중까지 함께 안내. 가입·설치 없이 무료.",
  openGraph: {
    title: "BMI 계산 — 한국·WHO 기준 동시 비교",
    description: "키·체중만 넣으면 BMI와 비만 단계 즉시. 한국·WHO 기준 함께 표시.",
    url: "https://calai.kr/bmi",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI 계산 — 한국·WHO 기준 동시 비교",
    description: "키·체중만 넣으면 BMI와 비만 단계 즉시. 한국·WHO 기준 함께 표시.",
  },
  alternates: { canonical: "https://calai.kr/bmi" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "BMI 계산기",
  "description": "키·체중 두 칸이면 BMI 지수와 비만 단계가 한 번에. 한국 비만학회 + WHO 기준을 나란히 비교, 표준체중까지 함께 안내. 가입·설치 없이 무료.",
  "url": "https://calai.kr/bmi",
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
