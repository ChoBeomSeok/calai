import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "운동 강도 심박수, 나이로 최대·구간별 자동",
  description: "나이만 입력하면 최대 심박수와 운동 강도 50~85% 구간별 심박수가 한눈에. 유산소·인터벌·근력 목표 강도 설정에.",
  openGraph: {
    title: "운동 심박수 — 강도별 구간 표",
    description: "나이 기준 최대·구간별(50~85%) 심박수 자동 표시.",
    url: "https://calai.kr/heart-rate",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "운동 심박수 — 강도별 구간 표",
    description: "나이 기준 최대·구간별(50~85%) 심박수 자동 표시.",
  },
  alternates: { canonical: "https://calai.kr/heart-rate" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "심박수 운동 강도",
  "description": "나이만 입력하면 최대 심박수와 운동 강도 50~85% 구간별 심박수가 한눈에. 유산소·인터벌·근력 목표 강도 설정에.",
  "url": "https://calai.kr/heart-rate",
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
