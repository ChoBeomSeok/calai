import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "결혼 비용 계산기, 예식·예물·신혼여행 한국 평균",
  description: "예식·예물·신혼여행·집 셋업 항목별 한국 평균 비용을 합산. 신랑·신부 분담까지 시뮬레이션, 결혼 자금 계획의 출발점.",
  openGraph: {
    title: "결혼 비용 — 항목별 한국 평균",
    description: "예식·예물·신혼여행·집 셋업 한국 평균을 항목별 합산.",
    url: "https://calai.kr/wedding-cost",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "결혼 비용 — 항목별 한국 평균",
    description: "예식·예물·신혼여행·집 셋업 한국 평균을 항목별 합산.",
  },
  alternates: { canonical: "https://calai.kr/wedding-cost" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "결혼 비용 계산기",
  "description": "예식·예물·신혼여행·집 셋업 항목별 한국 평균 비용을 합산. 신랑·신부 분담까지 시뮬레이션, 결혼 자금 계획의 출발점.",
  "url": "https://calai.kr/wedding-cost",
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
