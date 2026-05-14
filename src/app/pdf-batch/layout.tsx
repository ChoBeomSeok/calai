import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 일괄 처리, 100장+ 페이지번호·워터마크·잠금 한 번에",
  description: "여러 PDF에 페이지 번호·워터마크·메타 제거·비밀번호 잠금을 한 번에. 100장 이상 가능, zip 일괄 다운로드. 브라우저 처리.",
  openGraph: {
    title: "PDF 일괄 — 100장+ 한 번에",
    description: "여러 PDF 페이지 번호·워터마크·잠금 한 번에, zip 다운로드.",
    url: "https://calai.kr/pdf-batch",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 일괄 — 100장+ 한 번에",
    description: "여러 PDF 페이지 번호·워터마크·잠금 한 번에, zip 다운로드.",
  },
  alternates: { canonical: "https://calai.kr/pdf-batch" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 일괄 처리",
  "description": "여러 PDF에 페이지 번호·워터마크·메타 제거·비밀번호 잠금을 한 번에. 100장 이상 가능, zip 일괄 다운로드. 브라우저 처리.",
  "url": "https://calai.kr/pdf-batch",
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
