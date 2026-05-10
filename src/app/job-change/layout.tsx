import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이직 손익 계산기 — calai",
  description: "현재 vs 새 직장 연봉·복지·통근비 종합 비교.",
  openGraph: {
    title: "이직 손익 계산기 | calai",
    description: "현재 vs 새 직장 연봉·복지·통근비 종합 비교.",
    url: "https://calai.kr/job-change",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/job-change" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "이직 손익 계산기",
  description: "현재 vs 새 직장 연봉·복지·통근비 종합 비교.",
  url: "https://calai.kr/job-change",
  applicationCategory: "FinanceApplication",
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
