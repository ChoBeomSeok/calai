import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "결혼 비용 계산기 — calai",
  description: "예식·예물·신혼여행·집 셋업 항목별 한국 평균 합산.",
  openGraph: {
    title: "결혼 비용 계산기 | calai",
    description: "예식·예물·신혼여행·집 셋업 항목별 한국 평균 합산.",
    url: "https://calai.kr/wedding-cost",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/wedding-cost" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "결혼 비용 계산기",
  description: "예식·예물·신혼여행·집 셋업 항목별 한국 평균 합산.",
  url: "https://calai.kr/wedding-cost",
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
