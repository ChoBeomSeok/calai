import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "띠·별자리·혈액형 궁합, 생년월일로 한 번에",
  description: "생년월일을 넣으면 띠(12지신), 별자리(12궁), 그리고 혈액형까지 한 번에 확인. 친구·연인 궁합 빠른 진단에.",
  openGraph: {
    title: "띠·별자리 — 생일로 한 번에",
    description: "생년월일로 띠·12별자리·혈액형 궁합까지 즉시.",
    url: "https://www.calai.kr/zodiac",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "띠·별자리 — 생일로 한 번에",
    description: "생년월일로 띠·12별자리·혈액형 궁합까지 즉시.",
  },
  alternates: { canonical: "https://www.calai.kr/zodiac" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "띠·별자리 계산기",
  "description": "생년월일을 넣으면 띠(12지신), 별자리(12궁), 그리고 혈액형까지 한 번에 확인. 친구·연인 궁합 빠른 진단에.",
  "url": "https://www.calai.kr/zodiac",
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
