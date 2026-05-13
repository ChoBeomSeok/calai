import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "퇴직금 계산기 — calai",
  description: "재직기간·평균임금으로 퇴직금 즉시.",
  openGraph: {
    title: "퇴직금 계산기 | calai",
    description: "재직기간·평균임금으로 퇴직금 즉시.",
    url: "https://calai.kr/severance",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/severance" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "퇴직금 계산기",
  description: "재직기간·평균임금으로 퇴직금 즉시.",
  url: "https://calai.kr/severance",
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
