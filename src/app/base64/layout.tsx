import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 인코딩·디코딩 — calai",
  description: "문자열 ↔ Base64 양방향 변환 (UTF-8 한글 지원).",
  openGraph: {
    title: "Base64 인코딩·디코딩 | calai",
    description: "문자열 ↔ Base64 양방향 변환 (UTF-8 한글 지원).",
    url: "https://calai.kr/base64",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/base64" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Base64 인코딩·디코딩",
  description: "문자열 ↔ Base64 양방향 변환 (UTF-8 한글 지원).",
  url: "https://calai.kr/base64",
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
