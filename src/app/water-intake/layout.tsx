import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "수분 섭취량 계산기 — calai",
  description: "체중·활동량으로 일일 수분 권장량 자동.",
  openGraph: {
    title: "수분 섭취량 계산기 | calai",
    description: "체중·활동량으로 일일 수분 권장량 자동.",
    url: "https://calai.kr/water-intake",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/water-intake" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "수분 섭취량 계산기",
  description: "체중·활동량으로 일일 수분 권장량 자동.",
  url: "https://calai.kr/water-intake",
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
