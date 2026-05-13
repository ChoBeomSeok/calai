import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "D-Day 계산기 — calai",
  description: "두 날짜 차이 + N일 후·전 날짜 계산.",
  openGraph: {
    title: "D-Day 계산기 | calai",
    description: "두 날짜 차이 + N일 후·전 날짜 계산.",
    url: "https://calai.kr/dday",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/dday" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "D-Day 계산기",
  description: "두 날짜 차이 + N일 후·전 날짜 계산.",
  url: "https://calai.kr/dday",
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
