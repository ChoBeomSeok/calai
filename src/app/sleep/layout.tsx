import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "수면 시간 계산기 — calai",
  description: "기상 시간 → 90분 사이클 기반 취침 시간 추천.",
  openGraph: {
    title: "수면 시간 계산기 | calai",
    description: "기상 시간 → 90분 사이클 기반 취침 시간 추천.",
    url: "https://calai.kr/sleep",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/sleep" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "수면 시간 계산기",
  description: "기상 시간 → 90분 사이클 기반 취침 시간 추천.",
  url: "https://calai.kr/sleep",
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
