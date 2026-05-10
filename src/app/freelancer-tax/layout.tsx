import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프리랜서 3.3% 원천징수 — calai",
  description: "프리랜서 수익 → 원천징수 3.3% + 종합소득세 추정.",
  openGraph: {
    title: "프리랜서 3.3% 원천징수 | calai",
    description: "프리랜서 수익 → 원천징수 3.3% + 종합소득세 추정.",
    url: "https://calai.kr/freelancer-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/freelancer-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "프리랜서 3.3% 원천징수",
  description: "프리랜서 수익 → 원천징수 3.3% + 종합소득세 추정.",
  url: "https://calai.kr/freelancer-tax",
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
