import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "단위 변환기, 길이·무게·온도·부피·속도 한 페이지",
  description: "길이·무게·온도·부피·속도·면적까지 모든 단위 변환이 한 페이지에서. 어느 단위에 넣어도 나머지 단위가 즉시 변환.",
  openGraph: {
    title: "단위 변환 — 6분류 한 페이지",
    description: "길이·무게·온도·부피·속도·면적 모두 한 페이지에 양방향.",
    url: "https://calai.kr/unit",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "단위 변환 — 6분류 한 페이지",
    description: "길이·무게·온도·부피·속도·면적 모두 한 페이지에 양방향.",
  },
  alternates: { canonical: "https://calai.kr/unit" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "단위 변환기",
  "description": "길이·무게·온도·부피·속도·면적까지 모든 단위 변환이 한 페이지에서. 어느 단위에 넣어도 나머지 단위가 즉시 변환.",
  "url": "https://calai.kr/unit",
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
