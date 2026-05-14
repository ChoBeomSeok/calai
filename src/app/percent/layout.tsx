import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "백분율 계산기, %·증감률·전체에서 비율 한 번에",
  description: "A는 B의 몇 %? B의 X%는 얼마? 증감률은? 세 가지 계산을 한 페이지에서 즉시. 통계·할인·성적 등 모든 % 계산.",
  openGraph: {
    title: "백분율 — % 모든 계산",
    description: "비율·증감률·전체에서 %까지 3가지 계산 한 페이지.",
    url: "https://calai.kr/percent",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "백분율 — % 모든 계산",
    description: "비율·증감률·전체에서 %까지 3가지 계산 한 페이지.",
  },
  alternates: { canonical: "https://calai.kr/percent" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "백분율 계산기",
  "description": "A는 B의 몇 %? B의 X%는 얼마? 증감률은? 세 가지 계산을 한 페이지에서 즉시. 통계·할인·성적 등 모든 % 계산.",
  "url": "https://calai.kr/percent",
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
