import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "세계 시간 변환기 — calai",
  description: "한국 시간 ↔ 뉴욕·런던·도쿄 등 주요 도시 시차.",
  openGraph: {
    title: "세계 시간 변환기 | calai",
    description: "한국 시간 ↔ 뉴욕·런던·도쿄 등 주요 도시 시차.",
    url: "https://calai.kr/timezone",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/timezone" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "세계 시간 변환기",
  description: "한국 시간 ↔ 뉴욕·런던·도쿄 등 주요 도시 시차.",
  url: "https://calai.kr/timezone",
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
