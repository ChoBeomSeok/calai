import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "임대수익률 계산기 — calai",
  description: "매매가·보증금·월세로 연 임대수익률.",
  openGraph: {
    title: "임대수익률 계산기 | calai",
    description: "매매가·보증금·월세로 연 임대수익률.",
    url: "https://calai.kr/rental-yield",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/rental-yield" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "임대수익률 계산기",
  description: "매매가·보증금·월세로 연 임대수익률.",
  url: "https://calai.kr/rental-yield",
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
