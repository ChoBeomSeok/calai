import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "종합소득세 계산기 — calai",
  description: "사업·근로·이자 등 종합소득 누진세.",
  openGraph: {
    title: "종합소득세 계산기 | calai",
    description: "사업·근로·이자 등 종합소득 누진세.",
    url: "https://calai.kr/income-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/income-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "종합소득세 계산기",
  description: "사업·근로·이자 등 종합소득 누진세.",
  url: "https://calai.kr/income-tax",
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
