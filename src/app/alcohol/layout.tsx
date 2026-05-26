import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "음주 후 운전 가능 시간, 성별·체중으로 정확히",
  description: "성별·체중·음주량·시간으로 혈중 알코올 농도와 운전 가능 시간을 추정. 위드마크 공식 기반, 다음날 새벽 운전 전 필수 체크.",
  openGraph: {
    title: "음주 후 운전 가능 시간 추정",
    description: "위드마크 공식으로 체중·음주량별 운전 가능 시간 계산.",
    url: "https://www.calai.kr/alcohol",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "음주 후 운전 가능 시간 추정",
    description: "위드마크 공식으로 체중·음주량별 운전 가능 시간 계산.",
  },
  alternates: { canonical: "https://www.calai.kr/alcohol" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "음주 알코올 분해 시간",
  "description": "성별·체중·음주량·시간으로 혈중 알코올 농도와 운전 가능 시간을 추정. 위드마크 공식 기반, 다음날 새벽 운전 전 필수 체크.",
  "url": "https://www.calai.kr/alcohol",
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
