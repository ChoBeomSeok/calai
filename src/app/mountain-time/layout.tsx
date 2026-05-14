import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "등산 시간 계산기, 거리·고도로 정확한 코스 시간",
  description: "거리와 누적 고도만 입력하면 Naismith·Tobler 공식으로 예상 등산 시간을 추정. 들머리부터 정상까지 무리 없는 코스 계획에.",
  openGraph: {
    title: "등산 시간 — 거리·고도로 추정",
    description: "Naismith·Tobler 공식으로 코스 예상 시간 자동.",
    url: "https://calai.kr/mountain-time",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "등산 시간 — 거리·고도로 추정",
    description: "Naismith·Tobler 공식으로 코스 예상 시간 자동.",
  },
  alternates: { canonical: "https://calai.kr/mountain-time" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "등산 시간 계산기",
  "description": "거리와 누적 고도만 입력하면 Naismith·Tobler 공식으로 예상 등산 시간을 추정. 들머리부터 정상까지 무리 없는 코스 계획에.",
  "url": "https://calai.kr/mountain-time",
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
