import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 포매터 — calai",
  description: "JSON 문자열 정렬·압축·검증.",
  openGraph: {
    title: "JSON 포매터 | calai",
    description: "JSON 문자열 정렬·압축·검증.",
    url: "https://calai.kr/json-format",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/json-format" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON 포매터",
  description: "JSON 문자열 정렬·압축·검증.",
  url: "https://calai.kr/json-format",
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
