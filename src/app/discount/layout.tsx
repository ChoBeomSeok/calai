import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "할인율 계산기 — calai",
  description: "정가·할인율·할인가 양방향 계산.",
  openGraph: {
    title: "할인율 계산기 | calai",
    description: "정가·할인율·할인가 양방향 계산.",
    url: "https://calai.kr/discount",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/discount" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "할인율 계산기",
  description: "정가·할인율·할인가 양방향 계산.",
  url: "https://calai.kr/discount",
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
