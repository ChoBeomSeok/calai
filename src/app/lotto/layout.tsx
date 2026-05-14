import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 번호 생성기, 통계 패턴 반영 자동 추천",
  description: "로또 6/45 번호와 보너스를 자동 생성. 단순 랜덤이 아닌 자주 나오는 번호·범위 통계까지 함께 표시.",
  openGraph: {
    title: "로또 번호 — 통계 패턴 반영",
    description: "로또 6/45 번호 자동 생성 + 자주 나오는 번호 통계 표시.",
    url: "https://calai.kr/lotto",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "로또 번호 — 통계 패턴 반영",
    description: "로또 6/45 번호 자동 생성 + 자주 나오는 번호 통계 표시.",
  },
  alternates: { canonical: "https://calai.kr/lotto" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "로또 번호 생성기",
  "description": "로또 6/45 번호와 보너스를 자동 생성. 단순 랜덤이 아닌 자주 나오는 번호·범위 통계까지 함께 표시.",
  "url": "https://calai.kr/lotto",
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
