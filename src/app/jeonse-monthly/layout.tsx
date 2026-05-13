import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전월세 전환 계산기 — calai",
  description: "전세보증금 ↔ 월세 보증금/월세 변환.",
  openGraph: {
    title: "전월세 전환 계산기 | calai",
    description: "전세보증금 ↔ 월세 보증금/월세 변환.",
    url: "https://calai.kr/jeonse-monthly",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/jeonse-monthly" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "전월세 전환 계산기",
  description: "전세보증금 ↔ 월세 보증금/월세 변환.",
  url: "https://calai.kr/jeonse-monthly",
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
