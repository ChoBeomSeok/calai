import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자녀 양육비 계산기, 0~18세 누적 + 사교육 시뮬",
  description: "자녀 출생부터 18세까지의 누적 양육비를 단계별로 추정 + 사교육비 시나리오까지. 가족 자산 계획·출산 검토에.",
  openGraph: {
    title: "양육비 — 0~18세 누적 추정",
    description: "0~18세 양육비 단계별 + 사교육비 시나리오 시뮬레이션.",
    url: "https://www.calai.kr/child-cost",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "양육비 — 0~18세 누적 추정",
    description: "0~18세 양육비 단계별 + 사교육비 시나리오 시뮬레이션.",
  },
  alternates: { canonical: "https://www.calai.kr/child-cost" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "자녀 양육비 계산",
  "description": "자녀 출생부터 18세까지의 누적 양육비를 단계별로 추정 + 사교육비 시나리오까지. 가족 자산 계획·출산 검토에.",
  "url": "https://www.calai.kr/child-cost",
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
