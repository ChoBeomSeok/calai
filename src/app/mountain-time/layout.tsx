import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "등산 시간 계산기 — calai",
  description: "거리·고도로 예상 등산 시간 (Naismith·Tobler 공식).",
  openGraph: {
    title: "등산 시간 계산기 | calai",
    description: "거리·고도로 예상 등산 시간 (Naismith·Tobler 공식).",
    url: "https://calai.kr/mountain-time",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/mountain-time" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "등산 시간 계산기",
  description: "거리·고도로 예상 등산 시간 (Naismith·Tobler 공식).",
  url: "https://calai.kr/mountain-time",
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
