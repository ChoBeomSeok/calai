import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연차·휴가 계산기, 입사일·출근율 자동 반영",
  description: "입사일과 출근율을 넣으면 근로기준법 기준 연차(1년 미만 월차·1년차 26일·가산일수 포함)가 즉시. 인사 담당자·직장인 필수.",
  openGraph: {
    title: "연차 — 근로기준법 자동",
    description: "입사일·출근율로 1년 미만 월차·가산일수까지 연차 자동.",
    url: "https://www.calai.kr/annual-leave",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "연차 — 근로기준법 자동",
    description: "입사일·출근율로 1년 미만 월차·가산일수까지 연차 자동.",
  },
  alternates: { canonical: "https://www.calai.kr/annual-leave" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "연차·휴가 일수 계산기",
  "description": "입사일과 출근율을 넣으면 근로기준법 기준 연차(1년 미만 월차·1년차 26일·가산일수 포함)가 즉시. 인사 담당자·직장인 필수.",
  "url": "https://www.calai.kr/annual-leave",
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
