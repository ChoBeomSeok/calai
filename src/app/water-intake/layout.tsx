import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "하루 물 섭취량, 체중·활동량으로 권장량 즉시",
  description: "체중·활동량·기온을 반영해 하루 권장 수분 섭취량을 자동 산출. ml·잔 단위 동시 표시로 컵 갯수까지 한눈에.",
  openGraph: {
    title: "하루 물 권장량 — 체중 기준",
    description: "체중·활동량 반영해 ml·잔 단위로 동시 표시.",
    url: "https://www.calai.kr/water-intake",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "하루 물 권장량 — 체중 기준",
    description: "체중·활동량 반영해 ml·잔 단위로 동시 표시.",
  },
  alternates: { canonical: "https://www.calai.kr/water-intake" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "수분 섭취량 계산기",
  "description": "체중·활동량·기온을 반영해 하루 권장 수분 섭취량을 자동 산출. ml·잔 단위 동시 표시로 컵 갯수까지 한눈에.",
  "url": "https://www.calai.kr/water-intake",
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
