import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "재산세 계산기 — calai",
  description: "주택 공시가격으로 재산세 + 도시지역분 + 지방교육세.",
  openGraph: {
    title: "재산세 계산기 | calai",
    description: "주택 공시가격으로 재산세 + 도시지역분 + 지방교육세.",
    url: "https://calai.kr/property-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/property-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "재산세 계산기",
  description: "주택 공시가격으로 재산세 + 도시지역분 + 지방교육세.",
  url: "https://calai.kr/property-tax",
  applicationCategory: "BusinessApplication",
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
