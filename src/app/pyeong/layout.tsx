import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "평수·㎡ 변환기 — calai",
  description: "㎡ ↔ 평 ↔ 헥타르 ↔ ft² 즉시 변환.",
  openGraph: {
    title: "평수·㎡ 변환기 | calai",
    description: "㎡ ↔ 평 ↔ 헥타르 ↔ ft² 즉시 변환.",
    url: "https://calai.kr/pyeong",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/pyeong" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "평수·㎡ 변환기",
  description: "㎡ ↔ 평 ↔ 헥타르 ↔ ft² 즉시 변환.",
  url: "https://calai.kr/pyeong",
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
