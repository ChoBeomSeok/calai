import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전기차 충전 비용 — calai",
  description: "주행거리·전비·요금제로 충전 비용 + 주유비 비교.",
  openGraph: {
    title: "전기차 충전 비용 | calai",
    description: "주행거리·전비·요금제로 충전 비용 + 주유비 비교.",
    url: "https://calai.kr/ev-charge",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/ev-charge" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "전기차 충전 비용",
  description: "주행거리·전비·요금제로 충전 비용 + 주유비 비교.",
  url: "https://calai.kr/ev-charge",
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
