import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "실업급여 계산기 (2026) — calai",
  description: "평균임금·고용보험 가입기간·연령으로 1일 수급액·총 지급액·소정급여일수 자동 계산. 2026 고용보험법 기준.",
  openGraph: {
    title: "실업급여 계산기 (2026) | calai",
    description: "평균임금·가입기간·연령으로 수급액·일수 자동 계산. 2026 기준.",
    url: "https://calai.kr/unemployment-benefit",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/unemployment-benefit" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "실업급여 계산기 (2026)",
  description: "고용보험법 기준 실업급여 1일 수급액·총 지급액 자동 계산.",
  url: "https://calai.kr/unemployment-benefit",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
