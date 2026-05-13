import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "칼로리 계산기 (BMR·TDEE) — calai",
  description: "기초대사량·일일 소모 칼로리 + 다이어트·유지·벌크업 권장.",
  openGraph: {
    title: "칼로리 계산기 (BMR·TDEE) | calai",
    description: "기초대사량·일일 소모 칼로리 + 다이어트·유지·벌크업 권장.",
    url: "https://calai.kr/calorie",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/calorie" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "칼로리 계산기 (BMR·TDEE)",
  description: "기초대사량·일일 소모 칼로리 + 다이어트·유지·벌크업 권장.",
  url: "https://calai.kr/calorie",
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
