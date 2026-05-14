import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1RM 계산기, 든 무게·횟수로 최대 중량 추정",
  description: "들어올린 무게와 횟수로 1회 최대 중량(1RM)을 즉시 추정. 에프리·브제츠키·랜더 공식을 동시에 비교, 헬스 목표 설정에.",
  openGraph: {
    title: "1RM 추정 — 무게·횟수만 입력",
    description: "3가지 공식 비교로 1RM 추정, 헬스 루틴 짤 때 필수.",
    url: "https://calai.kr/one-rm",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "1RM 추정 — 무게·횟수만 입력",
    description: "3가지 공식 비교로 1RM 추정, 헬스 루틴 짤 때 필수.",
  },
  alternates: { canonical: "https://calai.kr/one-rm" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "1RM 계산기",
  "description": "들어올린 무게와 횟수로 1회 최대 중량(1RM)을 즉시 추정. 에프리·브제츠키·랜더 공식을 동시에 비교, 헬스 목표 설정에.",
  "url": "https://calai.kr/one-rm",
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
