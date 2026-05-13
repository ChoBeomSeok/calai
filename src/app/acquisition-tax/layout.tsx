import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "취득세 계산기 — calai",
  description: "매매가·전용면적·1주택/다주택 기준 취득세.",
  openGraph: {
    title: "취득세 계산기 | calai",
    description: "매매가·전용면적·1주택/다주택 기준 취득세.",
    url: "https://calai.kr/acquisition-tax",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/acquisition-tax" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "취득세 계산기",
  description: "매매가·전용면적·1주택/다주택 기준 취득세.",
  url: "https://calai.kr/acquisition-tax",
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
