import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주유비 계산기, 거리·연비·기름값으로 한 번에",
  description: "주행거리·차량 연비·현재 기름값을 넣으면 총 주유비가 즉시. 장거리 여행 전 예산 짤 때, 차량 간 연비 비교 시 활용.",
  openGraph: {
    title: "주유비 — 거리·연비·기름값",
    description: "거리·연비·기름값으로 장거리 여행 주유비 즉시 산출.",
    url: "https://calai.kr/fuel-cost",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "주유비 — 거리·연비·기름값",
    description: "거리·연비·기름값으로 장거리 여행 주유비 즉시 산출.",
  },
  alternates: { canonical: "https://calai.kr/fuel-cost" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "주유비 계산기",
  "description": "주행거리·차량 연비·현재 기름값을 넣으면 총 주유비가 즉시. 장거리 여행 전 예산 짤 때, 차량 간 연비 비교 시 활용.",
  "url": "https://calai.kr/fuel-cost",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "inLanguage": "ko",
  "isAccessibleForFree": true
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
