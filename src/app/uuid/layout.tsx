import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID 생성기 — calai",
  description: "UUID v4 즉시 생성 (1~100개 일괄).",
  openGraph: {
    title: "UUID 생성기 | calai",
    description: "UUID v4 즉시 생성 (1~100개 일괄).",
    url: "https://calai.kr/uuid",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/uuid" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UUID 생성기",
  description: "UUID v4 즉시 생성 (1~100개 일괄).",
  url: "https://calai.kr/uuid",
  applicationCategory: "DeveloperApplication",
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
