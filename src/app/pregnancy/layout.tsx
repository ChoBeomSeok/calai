import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "임신 주차·출산 예정일 — calai",
  description: "마지막 생리일 → 임신 주차·출산 예정일·태교 시기 자동.",
  openGraph: {
    title: "임신 주차·출산 예정일 | calai",
    description: "마지막 생리일 → 임신 주차·출산 예정일·태교 시기 자동.",
    url: "https://calai.kr/pregnancy",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/pregnancy" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "임신 주차·출산 예정일",
  description: "마지막 생리일 → 임신 주차·출산 예정일·태교 시기 자동.",
  url: "https://calai.kr/pregnancy",
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
