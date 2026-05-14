import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마크다운 미리보기·HTML·PDF 변환, GFM 실시간",
  description: "Markdown을 실시간 HTML 미리보기로 확인하고 HTML·PDF로 바로 다운로드. GFM 표·체크박스·코드 하이라이팅 지원.",
  openGraph: {
    title: "마크다운 — HTML·PDF 변환",
    description: "MD 실시간 미리보기 + HTML·PDF 다운로드, GFM 지원.",
    url: "https://calai.kr/markdown",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "마크다운 — HTML·PDF 변환",
    description: "MD 실시간 미리보기 + HTML·PDF 다운로드, GFM 지원.",
  },
  alternates: { canonical: "https://calai.kr/markdown" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "마크다운 미리보기·변환",
  "description": "Markdown을 실시간 HTML 미리보기로 확인하고 HTML·PDF로 바로 다운로드. GFM 표·체크박스·코드 하이라이팅 지원.",
  "url": "https://calai.kr/markdown",
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
