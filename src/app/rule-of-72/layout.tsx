import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "72의 법칙 계산기 — calai",
  description: "현재 금리에서 자산이 2배 되는 기간 즉시 계산.",
  openGraph: {
    title: "72의 법칙 계산기 | calai",
    description: "현재 금리에서 자산이 2배 되는 기간 즉시 계산.",
    url: "https://calai.kr/rule-of-72",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/rule-of-72" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "72의 법칙 계산기",
  description: "현재 금리에서 자산이 2배 되는 기간 즉시 계산.",
  url: "https://calai.kr/rule-of-72",
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
