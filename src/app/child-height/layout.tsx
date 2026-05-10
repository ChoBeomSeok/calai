import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "어린이 키 예측 — calai",
  description: "부모 키·성별로 자녀 예상 성인 키 (Tanner 공식).",
  openGraph: {
    title: "어린이 키 예측 | calai",
    description: "부모 키·성별로 자녀 예상 성인 키 (Tanner 공식).",
    url: "https://calai.kr/child-height",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/child-height" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "어린이 키 예측",
  description: "부모 키·성별로 자녀 예상 성인 키 (Tanner 공식).",
  url: "https://calai.kr/child-height",
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
