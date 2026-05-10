import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1RM 계산기 — calai",
  description: "들어올린 무게·횟수로 1회 최대 중량(1RM) 추정.",
  openGraph: {
    title: "1RM 계산기 | calai",
    description: "들어올린 무게·횟수로 1회 최대 중량(1RM) 추정.",
    url: "https://calai.kr/one-rm",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/one-rm" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "1RM 계산기",
  description: "들어올린 무게·횟수로 1회 최대 중량(1RM) 추정.",
  url: "https://calai.kr/one-rm",
  applicationCategory: "HealthApplication",
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
