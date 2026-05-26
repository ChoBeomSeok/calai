import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "한국에서 몇 번째? 같은 생일·이름·키 순위 진단",
  description: "생년월일·이름·키만 넣으면 같은 생일 동기·이름·키 분위·성씨 순위·누적 출생 순번 등 6가지를 한 페이지에서 진단.",
  openGraph: {
    title: "한국 순위 — 6가지 진단",
    description: "같은 생일·이름·키 분위·성씨 순위 등 6지표 한 페이지.",
    url: "https://www.calai.kr/korea-rank",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "한국 순위 — 6가지 진단",
    description: "같은 생일·이름·키 분위·성씨 순위 등 6지표 한 페이지.",
  },
  alternates: { canonical: "https://www.calai.kr/korea-rank" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "한국에서 몇 번째? 진단",
  "description": "생년월일·이름·키만 넣으면 같은 생일 동기·이름·키 분위·성씨 순위·누적 출생 순번 등 6가지를 한 페이지에서 진단.",
  "url": "https://www.calai.kr/korea-rank",
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
