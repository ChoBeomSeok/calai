import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자동차세 계산기 — calai",
  description: "배기량·연식별 자동차세 + 차령 경감.",
  openGraph: {
    title: "자동차세 계산기 | calai",
    description: "배기량·연식별 자동차세 + 차령 경감.",
    url: "https://calai.kr/car-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/car-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "자동차세 계산기",
  description: "배기량·연식별 자동차세 + 차령 경감.",
  url: "https://calai.kr/car-tax",
  applicationCategory: "BusinessApplication",
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
