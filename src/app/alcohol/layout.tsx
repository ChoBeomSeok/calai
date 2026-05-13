import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "음주 알코올 분해 시간 — calai",
  description: "성별·체중·음주량으로 운전 가능 시간 추정.",
  openGraph: {
    title: "음주 알코올 분해 시간 | calai",
    description: "성별·체중·음주량으로 운전 가능 시간 추정.",
    url: "https://calai.kr/alcohol",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/alcohol" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "음주 알코올 분해 시간",
  description: "성별·체중·음주량으로 운전 가능 시간 추정.",
  url: "https://calai.kr/alcohol",
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
