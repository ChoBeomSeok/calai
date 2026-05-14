import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "임신 주차 계산기, 출산 예정일·태교 시기까지 자동",
  description: "마지막 생리일만 넣으면 현재 임신 주차, 출산 예정일, 태교·검진 시기가 한눈에. 산모수첩 없이도 즉시 확인.",
  openGraph: {
    title: "임신 주차 — 출산 예정일 자동",
    description: "마지막 생리일로 주차·출산일·태교 시기 즉시 확인.",
    url: "https://calai.kr/pregnancy",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "임신 주차 — 출산 예정일 자동",
    description: "마지막 생리일로 주차·출산일·태교 시기 즉시 확인.",
  },
  alternates: { canonical: "https://calai.kr/pregnancy" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "임신 주차 계산기",
  "description": "마지막 생리일만 넣으면 현재 임신 주차, 출산 예정일, 태교·검진 시기가 한눈에. 산모수첩 없이도 즉시 확인.",
  "url": "https://calai.kr/pregnancy",
  "applicationCategory": "HealthApplication",
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
