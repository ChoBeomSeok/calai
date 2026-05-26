import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "실업급여 계산기, 1일 수급액·총 지급액 즉시",
  description: "평균임금과 고용보험 가입 기간을 넣으면 1일 수급액·총 지급액·수급 기간이 자동. 2026 고용보험법 기준 반영.",
  openGraph: {
    title: "실업급여 — 수급액·기간 자동",
    description: "평균임금·가입기간 입력으로 1일 수급액과 총 기간 즉시.",
    url: "https://www.calai.kr/unemployment-benefit",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "실업급여 — 수급액·기간 자동",
    description: "평균임금·가입기간 입력으로 1일 수급액과 총 기간 즉시.",
  },
  alternates: { canonical: "https://www.calai.kr/unemployment-benefit" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "실업급여 계산기",
  "description": "평균임금과 고용보험 가입 기간을 넣으면 1일 수급액·총 지급액·수급 기간이 자동. 2026 고용보험법 기준 반영.",
  "url": "https://www.calai.kr/unemployment-benefit",
  "applicationCategory": "FinanceApplication",
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
