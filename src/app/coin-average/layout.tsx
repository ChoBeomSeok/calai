import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "가상화폐 평단가 — calai",
  description: "기존 코인 + 추가 매수로 평균 매수가.",
  openGraph: {
    title: "가상화폐 평단가 | calai",
    description: "기존 코인 + 추가 매수로 평균 매수가.",
    url: "https://calai.kr/coin-average",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/coin-average" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "가상화폐 평단가",
  description: "기존 코인 + 추가 매수로 평균 매수가.",
  url: "https://calai.kr/coin-average",
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
