import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "외환 송금 수수료 — calai",
  description: "은행·송금 서비스별 수수료 + 환율 우대 비교.",
  openGraph: {
    title: "외환 송금 수수료 | calai",
    description: "은행·송금 서비스별 수수료 + 환율 우대 비교.",
    url: "https://calai.kr/remit-fee",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/remit-fee" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "외환 송금 수수료",
  description: "은행·송금 서비스별 수수료 + 환율 우대 비교.",
  url: "https://calai.kr/remit-fee",
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
