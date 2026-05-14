import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "평수 ↔ ㎡ 변환기, 평·헥타르·ft² 한 번에",
  description: "㎡·평·헥타르·ft² 어느 단위든 한 칸에 넣으면 나머지 모두 즉시 변환. 부동산 매물·전세 평수 환산에 자주 쓰임.",
  openGraph: {
    title: "평수 변환 — 4단위 동시",
    description: "㎡·평·헥타르·ft² 어느 값이든 입력하면 모두 동시 변환.",
    url: "https://calai.kr/pyeong",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "평수 변환 — 4단위 동시",
    description: "㎡·평·헥타르·ft² 어느 값이든 입력하면 모두 동시 변환.",
  },
  alternates: { canonical: "https://calai.kr/pyeong" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "평수·㎡ 변환기",
  "description": "㎡·평·헥타르·ft² 어느 단위든 한 칸에 넣으면 나머지 모두 즉시 변환. 부동산 매물·전세 평수 환산에 자주 쓰임.",
  "url": "https://calai.kr/pyeong",
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
