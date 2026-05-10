import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "코인 손익 계산기 — calai",
  description: "매수가·매도가·수량으로 손익률·실현 수익 계산.",
  openGraph: {
    title: "코인 손익 계산기 | calai",
    description: "매수가·매도가·수량으로 손익률·실현 수익 계산.",
    url: "https://calai.kr/coin-pl",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/coin-pl" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "코인 손익 계산기",
  description: "매수가·매도가·수량으로 손익률·실현 수익 계산.",
  url: "https://calai.kr/coin-pl",
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
