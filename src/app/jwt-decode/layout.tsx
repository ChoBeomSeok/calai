import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT 디코더, header·payload·signature 즉시 분석",
  description: "JWT 토큰을 붙여 넣으면 header·payload·signature 세 영역과 만료 시간(exp)까지 즉시 분석. 토큰은 서버로 전송되지 않습니다.",
  openGraph: {
    title: "JWT 디코더 — 토큰 즉시 분석",
    description: "JWT의 header·payload·만료까지 즉시 분석, 토큰 외부 X.",
    url: "https://calai.kr/jwt-decode",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT 디코더 — 토큰 즉시 분석",
    description: "JWT의 header·payload·만료까지 즉시 분석, 토큰 외부 X.",
  },
  alternates: { canonical: "https://calai.kr/jwt-decode" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "JWT 디코더",
  "description": "JWT 토큰을 붙여 넣으면 header·payload·signature 세 영역과 만료 시간(exp)까지 즉시 분석. 토큰은 서버로 전송되지 않습니다.",
  "url": "https://calai.kr/jwt-decode",
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
