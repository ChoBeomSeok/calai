import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 — calai",
  description: "연봉 → 4대보험·소득세 차감 후 월 실수령.",
  openGraph: {
    title: "연봉 실수령액 계산기 | calai",
    description: "연봉 → 4대보험·소득세 차감 후 월 실수령.",
    url: "https://calai.kr/salary",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/salary" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "연봉 실수령액 계산기",
  description: "연봉 → 4대보험·소득세 차감 후 월 실수령.",
  url: "https://calai.kr/salary",
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
