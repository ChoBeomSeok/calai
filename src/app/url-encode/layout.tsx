import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL 인코딩·디코딩, 한글·특수문자 양방향 즉시",
  description: "URL의 한글·공백·특수문자를 percent-encoding으로 변환하거나 디코딩. 쿼리스트링·API 요청 디버깅에 자주 사용.",
  openGraph: {
    title: "URL 인코딩 — 한글·특수문자",
    description: "URL 한글·특수문자 percent-encoding 양방향 즉시.",
    url: "https://www.calai.kr/url-encode",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL 인코딩 — 한글·특수문자",
    description: "URL 한글·특수문자 percent-encoding 양방향 즉시.",
  },
  alternates: { canonical: "https://www.calai.kr/url-encode" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "URL 인코딩·디코딩",
  "description": "URL의 한글·공백·특수문자를 percent-encoding으로 변환하거나 디코딩. 쿼리스트링·API 요청 디버깅에 자주 사용.",
  "url": "https://www.calai.kr/url-encode",
  "applicationCategory": "DeveloperApplication",
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
