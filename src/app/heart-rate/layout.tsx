import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "심박수 운동 강도 — calai",
  description: "나이로 최대·운동 강도 50~85% 심박수 자동.",
  openGraph: {
    title: "심박수 운동 강도 | calai",
    description: "나이로 최대·운동 강도 50~85% 심박수 자동.",
    url: "https://calai.kr/heart-rate",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/heart-rate" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "심박수 운동 강도",
  description: "나이로 최대·운동 강도 50~85% 심박수 자동.",
  url: "https://calai.kr/heart-rate",
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
