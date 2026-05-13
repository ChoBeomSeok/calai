import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "휴가 일수 계산 — calai",
  description: "입사일 → 근로기준법 기준 연차 자동 계산.",
  openGraph: {
    title: "휴가 일수 계산 | calai",
    description: "입사일 → 근로기준법 기준 연차 자동 계산.",
    url: "https://calai.kr/annual-leave",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/annual-leave" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "휴가 일수 계산",
  description: "입사일 → 근로기준법 기준 연차 자동 계산.",
  url: "https://calai.kr/annual-leave",
  applicationCategory: "UtilitiesApplication",
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
