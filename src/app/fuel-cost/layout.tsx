import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주유비 계산기 — calai",
  description: "주행거리·연비·기름값으로 총 주유비.",
  openGraph: {
    title: "주유비 계산기 | calai",
    description: "주행거리·연비·기름값으로 총 주유비.",
    url: "https://calai.kr/fuel-cost",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/fuel-cost" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "주유비 계산기",
  description: "주행거리·연비·기름값으로 총 주유비.",
  url: "https://calai.kr/fuel-cost",
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
