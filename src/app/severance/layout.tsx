import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "퇴직금 계산기, 평균임금·재직기간 즉시 산출",
  description: "입사일·퇴사일과 최근 3개월 평균임금을 넣으면 근로기준법 기준 퇴직금이 즉시. 퇴직 전 협의·확인용으로 필수.",
  openGraph: {
    title: "퇴직금 — 평균임금·재직 자동",
    description: "재직기간·평균임금으로 근로기준법 퇴직금 즉시.",
    url: "https://www.calai.kr/severance",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "퇴직금 — 평균임금·재직 자동",
    description: "재직기간·평균임금으로 근로기준법 퇴직금 즉시.",
  },
  alternates: { canonical: "https://www.calai.kr/severance" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "퇴직금 계산기",
  "description": "입사일·퇴사일과 최근 3개월 평균임금을 넣으면 근로기준법 기준 퇴직금이 즉시. 퇴직 전 협의·확인용으로 필수.",
  "url": "https://www.calai.kr/severance",
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
