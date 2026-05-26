import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 페이지 추출, 원하는 페이지만 새 파일로",
  description: "PDF 전체에서 필요한 페이지만 골라 새 파일로 무료 추출. 페이지 범위 지정 가능, 브라우저 내 처리로 안전.",
  openGraph: {
    title: "PDF 추출 — 원하는 페이지만",
    description: "PDF에서 필요한 페이지만 골라 새 파일로 무료 추출.",
    url: "https://www.calai.kr/pdf-extract",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 추출 — 원하는 페이지만",
    description: "PDF에서 필요한 페이지만 골라 새 파일로 무료 추출.",
  },
  alternates: { canonical: "https://www.calai.kr/pdf-extract" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 페이지 추출",
  "description": "PDF 전체에서 필요한 페이지만 골라 새 파일로 무료 추출. 페이지 범위 지정 가능, 브라우저 내 처리로 안전.",
  "url": "https://www.calai.kr/pdf-extract",
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
