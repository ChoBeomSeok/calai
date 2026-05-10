import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "적금 만기 계산기 — calai",
  description: "월 적립액·금리·기간으로 만기 수령액·세후 실수령.",
  openGraph: {
    title: "적금 만기 계산기 | calai",
    description: "월 적립액·금리·기간으로 만기 수령액·세후 실수령.",
    url: "https://calai.kr/savings",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/savings" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "적금 만기 계산기",
  description: "월 적립액·금리·기간으로 만기 수령액·세후 실수령.",
  url: "https://calai.kr/savings",
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
