import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이직 손익 계산기, 연봉·복지·통근비 종합 비교",
  description: "현 직장과 새 직장의 연봉·복지(식대·보너스)·통근비·시간을 종합 비교. 단순 연봉 차이를 넘은 실질 이익을 한눈에.",
  openGraph: {
    title: "이직 손익 — 실질 이익 비교",
    description: "연봉·복지·통근비 합산 비교로 진짜 이득인지 한눈에 판단.",
    url: "https://www.calai.kr/job-change",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "이직 손익 — 실질 이익 비교",
    description: "연봉·복지·통근비 합산 비교로 진짜 이득인지 한눈에 판단.",
  },
  alternates: { canonical: "https://www.calai.kr/job-change" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "이직 손익 계산기",
  "description": "현 직장과 새 직장의 연봉·복지(식대·보너스)·통근비·시간을 종합 비교. 단순 연봉 차이를 넘은 실질 이익을 한눈에.",
  "url": "https://www.calai.kr/job-change",
  "applicationCategory": "FinanceApplication",
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
