import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "궁합 계산기, 두 사람 생년월일로 동·서양 동시",
  description: "두 사람의 생년월일을 넣으면 동양 띠·서양 별자리 기준 궁합을 동시 분석. 연인·친구·결혼 상대 빠른 진단에.",
  openGraph: {
    title: "궁합 — 동·서양 동시 분석",
    description: "생년월일 두 개로 띠·별자리 기준 궁합 동시 진단.",
    url: "https://calai.kr/compatibility",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "궁합 — 동·서양 동시 분석",
    description: "생년월일 두 개로 띠·별자리 기준 궁합 동시 진단.",
  },
  alternates: { canonical: "https://calai.kr/compatibility" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "궁합 계산기",
  "description": "두 사람의 생년월일을 넣으면 동양 띠·서양 별자리 기준 궁합을 동시 분석. 연인·친구·결혼 상대 빠른 진단에.",
  "url": "https://calai.kr/compatibility",
  "applicationCategory": "LifestyleApplication",
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
