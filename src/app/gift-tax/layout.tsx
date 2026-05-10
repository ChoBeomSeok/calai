import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "증여세 계산기 — calai",
  description: "증여재산·관계별 공제로 증여세 누진.",
  openGraph: {
    title: "증여세 계산기 | calai",
    description: "증여재산·관계별 공제로 증여세 누진.",
    url: "https://calai.kr/gift-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/gift-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "증여세 계산기",
  description: "증여재산·관계별 공제로 증여세 누진.",
  url: "https://calai.kr/gift-tax",
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
