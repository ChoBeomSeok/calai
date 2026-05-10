import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL 인코딩·디코딩 — calai",
  description: "URL 특수문자·한글 인코딩·디코딩.",
  openGraph: {
    title: "URL 인코딩·디코딩 | calai",
    description: "URL 특수문자·한글 인코딩·디코딩.",
    url: "https://calai.kr/url-encode",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/url-encode" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "URL 인코딩·디코딩",
  description: "URL 특수문자·한글 인코딩·디코딩.",
  url: "https://calai.kr/url-encode",
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
