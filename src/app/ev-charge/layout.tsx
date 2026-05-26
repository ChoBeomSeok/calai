import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전기차 충전 비용 계산기, 주유비와 직접 비교",
  description: "주행거리·전비·요금제(완속·급속·홈)별 충전 비용과 동급 휘발유 차량의 주유비를 같은 화면에서 비교. 전기차 전환 검토용.",
  openGraph: {
    title: "전기차 충전 — 주유비와 비교",
    description: "거리·전비·요금제로 충전 비용 산출 + 주유비 직접 비교.",
    url: "https://www.calai.kr/ev-charge",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "전기차 충전 — 주유비와 비교",
    description: "거리·전비·요금제로 충전 비용 산출 + 주유비 직접 비교.",
  },
  alternates: { canonical: "https://www.calai.kr/ev-charge" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "전기차 충전 비용",
  "description": "주행거리·전비·요금제(완속·급속·홈)별 충전 비용과 동급 휘발유 차량의 주유비를 같은 화면에서 비교. 전기차 전환 검토용.",
  "url": "https://www.calai.kr/ev-charge",
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
