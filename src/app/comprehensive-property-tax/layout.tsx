import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "종합부동산세 계산기 — calai",
  description: "공시가격·1주택/다주택으로 종부세 누진 계산.",
  openGraph: {
    title: "종합부동산세 계산기 | calai",
    description: "공시가격·1주택/다주택으로 종부세 누진 계산.",
    url: "https://calai.kr/comprehensive-property-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/comprehensive-property-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "종합부동산세 계산기",
  description: "공시가격·1주택/다주택으로 종부세 누진 계산.",
  url: "https://calai.kr/comprehensive-property-tax",
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
