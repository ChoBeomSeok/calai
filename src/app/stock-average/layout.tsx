import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주식 평단가 계산기 — calai",
  description: "기존 보유 + 추가 매수로 평균 단가.",
  openGraph: {
    title: "주식 평단가 계산기 | calai",
    description: "기존 보유 + 추가 매수로 평균 단가.",
    url: "https://calai.kr/stock-average",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/stock-average" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "주식 평단가 계산기",
  description: "기존 보유 + 추가 매수로 평균 단가.",
  url: "https://calai.kr/stock-average",
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
