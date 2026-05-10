import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "환율 변환기 — calai",
  description: "USD·JPY·EUR·CNY·원 즉시 변환.",
  openGraph: {
    title: "환율 변환기 | calai",
    description: "USD·JPY·EUR·CNY·원 즉시 변환.",
    url: "https://calai.kr/exchange",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/exchange" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "환율 변환기",
  description: "USD·JPY·EUR·CNY·원 즉시 변환.",
  url: "https://calai.kr/exchange",
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
