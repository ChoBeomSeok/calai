import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "인플레이션 환산 — calai",
  description: "10년 전 100만원 = 지금 얼마 / 미래 가치 추정.",
  openGraph: {
    title: "인플레이션 환산 | calai",
    description: "10년 전 100만원 = 지금 얼마 / 미래 가치 추정.",
    url: "https://calai.kr/inflation",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/inflation" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "인플레이션 환산",
  description: "10년 전 100만원 = 지금 얼마 / 미래 가치 추정.",
  url: "https://calai.kr/inflation",
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
