import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글자수 세기 (무료) — calai",
  description: "공백 포함·제외, 바이트, 원고지 매수, 자소서·SNS 한도 실시간 표시. 자소서·논문 필수.",
  openGraph: {
    title: "글자수 세기 (무료) | calai",
    description: "공백 포함·제외, 바이트, 원고지 매수, 자소서·SNS 한도 실시간.",
    url: "https://calai.kr/word-count",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/word-count" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "글자수 세기 (무료)",
  description: "공백 포함·제외, 바이트, 원고지 매수, 자소서 한도 실시간 카운트.",
  url: "https://calai.kr/word-count",
  applicationCategory: "UtilitiesApplication",
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
