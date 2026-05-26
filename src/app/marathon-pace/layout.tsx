import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마라톤 페이스 계산기, 목표 시간으로 km당 분 자동",
  description: "5km·10km·하프·풀 마라톤의 목표 완주 시간을 넣으면 km당 페이스와 구간별 통과 시간이 자동. 대회 전 페이스 전략에.",
  openGraph: {
    title: "마라톤 페이스 — km당 분 자동",
    description: "목표 완주 시간으로 km당 페이스·구간 통과 시간 자동.",
    url: "https://www.calai.kr/marathon-pace",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "마라톤 페이스 — km당 분 자동",
    description: "목표 완주 시간으로 km당 페이스·구간 통과 시간 자동.",
  },
  alternates: { canonical: "https://www.calai.kr/marathon-pace" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "마라톤 페이스 계산기",
  "description": "5km·10km·하프·풀 마라톤의 목표 완주 시간을 넣으면 km당 페이스와 구간별 통과 시간이 자동. 대회 전 페이스 전략에.",
  "url": "https://www.calai.kr/marathon-pace",
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
