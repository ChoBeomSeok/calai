import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "단위 변환기 — calai",
  description: "길이·무게·온도·부피·속도 모든 단위 변환.",
  openGraph: {
    title: "단위 변환기 | calai",
    description: "길이·무게·온도·부피·속도 모든 단위 변환.",
    url: "https://calai.kr/unit",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/unit" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "단위 변환기",
  description: "길이·무게·온도·부피·속도 모든 단위 변환.",
  url: "https://calai.kr/unit",
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
