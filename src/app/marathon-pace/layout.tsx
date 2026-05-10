import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마라톤 페이스 계산기 — calai",
  description: "5km·10km·하프·풀 마라톤 목표 시간 → 페이스 (km당 분).",
  openGraph: {
    title: "마라톤 페이스 계산기 | calai",
    description: "5km·10km·하프·풀 마라톤 목표 시간 → 페이스 (km당 분).",
    url: "https://calai.kr/marathon-pace",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/marathon-pace" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "마라톤 페이스 계산기",
  description: "5km·10km·하프·풀 마라톤 목표 시간 → 페이스 (km당 분).",
  url: "https://calai.kr/marathon-pace",
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
