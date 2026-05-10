import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주차 요금 계산기 — calai",
  description: "기본 요금·추가 시간·할인으로 주차비 자동.",
  openGraph: {
    title: "주차 요금 계산기 | calai",
    description: "기본 요금·추가 시간·할인으로 주차비 자동.",
    url: "https://calai.kr/parking-fee",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/parking-fee" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "주차 요금 계산기",
  description: "기본 요금·추가 시간·할인으로 주차비 자동.",
  url: "https://calai.kr/parking-fee",
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
