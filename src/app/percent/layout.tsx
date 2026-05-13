import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "백분율 계산기 — calai",
  description: "% 비율·증감율·전체값에서 % 추출.",
  openGraph: {
    title: "백분율 계산기 | calai",
    description: "% 비율·증감율·전체값에서 % 추출.",
    url: "https://calai.kr/percent",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/percent" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "백분율 계산기",
  description: "% 비율·증감율·전체값에서 % 추출.",
  url: "https://calai.kr/percent",
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
