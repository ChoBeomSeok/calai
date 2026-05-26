import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 포매터, 정렬·압축·문법 검증 한 번에",
  description: "JSON 문자열을 들여쓰기 정렬, 한 줄 압축, 문법 오류 검증까지 한 페이지에서. 오류 위치를 줄·열로 정확히 표시.",
  openGraph: {
    title: "JSON 포매터 — 정렬·압축·검증",
    description: "JSON 정렬·압축·문법 검증, 오류 위치를 줄·열로 표시.",
    url: "https://www.calai.kr/json-format",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON 포매터 — 정렬·압축·검증",
    description: "JSON 정렬·압축·문법 검증, 오류 위치를 줄·열로 표시.",
  },
  alternates: { canonical: "https://www.calai.kr/json-format" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "JSON 포매터",
  "description": "JSON 문자열을 들여쓰기 정렬, 한 줄 압축, 문법 오류 검증까지 한 페이지에서. 오류 위치를 줄·열로 정확히 표시.",
  "url": "https://www.calai.kr/json-format",
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
