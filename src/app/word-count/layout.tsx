import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글자수 세기, 자소서·SNS 한도 실시간 표시",
  description: "공백 포함·제외·바이트·원고지 매수·자소서·SNS 한도(트위터·인스타)까지 실시간 카운트. 자소서·논문·블로그 글에 필수.",
  openGraph: {
    title: "글자수 — 자소서·SNS 한도",
    description: "공백·바이트·원고지·SNS 한도 실시간 카운트, 자소서 필수.",
    url: "https://www.calai.kr/word-count",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "글자수 — 자소서·SNS 한도",
    description: "공백·바이트·원고지·SNS 한도 실시간 카운트, 자소서 필수.",
  },
  alternates: { canonical: "https://www.calai.kr/word-count" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "글자수 세기",
  "description": "공백 포함·제외·바이트·원고지 매수·자소서·SNS 한도(트위터·인스타)까지 실시간 카운트. 자소서·논문·블로그 글에 필수.",
  "url": "https://www.calai.kr/word-count",
  "applicationCategory": "BusinessApplication",
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
