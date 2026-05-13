import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전기요금 계산기 — calai",
  description: "월 사용량 → 주택용 누진제 자동 계산.",
  openGraph: {
    title: "전기요금 계산기 | calai",
    description: "월 사용량 → 주택용 누진제 자동 계산.",
    url: "https://calai.kr/electricity",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/electricity" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "전기요금 계산기",
  description: "월 사용량 → 주택용 누진제 자동 계산.",
  url: "https://calai.kr/electricity",
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
