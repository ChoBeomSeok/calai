import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT 디코더 — calai",
  description: "JWT 토큰의 header·payload·signature 즉시 분석.",
  openGraph: {
    title: "JWT 디코더 | calai",
    description: "JWT 토큰의 header·payload·signature 즉시 분석.",
    url: "https://calai.kr/jwt-decode",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/jwt-decode" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JWT 디코더",
  description: "JWT 토큰의 header·payload·signature 즉시 분석.",
  url: "https://calai.kr/jwt-decode",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
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
