import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI 계산기 — calai",
  description: "키·체중으로 비만도 즉시 계산. 한국·WHO 기준 비교.",
  openGraph: {
    title: "BMI 계산기 | calai",
    description: "키·체중으로 비만도 즉시 계산. 한국·WHO 기준 비교.",
    url: "https://calai.kr/bmi",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/bmi" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BMI 계산기",
  description: "키·체중으로 비만도 즉시 계산. 한국·WHO 기준 비교.",
  url: "https://calai.kr/bmi",
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
