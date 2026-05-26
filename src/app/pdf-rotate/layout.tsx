import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 회전, 90·180·270도 무료 한 번에",
  description: "PDF 페이지를 90·180·270도 회전해 가로·세로 정렬을 맞춤. 페이지별 다른 각도 가능, 가입·설치·워터마크 없음.",
  openGraph: {
    title: "PDF 회전 — 90·180·270도",
    description: "PDF 페이지 90·180·270도 무료 회전, 페이지별 각도 가능.",
    url: "https://www.calai.kr/pdf-rotate",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 회전 — 90·180·270도",
    description: "PDF 페이지 90·180·270도 무료 회전, 페이지별 각도 가능.",
  },
  alternates: { canonical: "https://www.calai.kr/pdf-rotate" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 회전",
  "description": "PDF 페이지를 90·180·270도 회전해 가로·세로 정렬을 맞춤. 페이지별 다른 각도 가능, 가입·설치·워터마크 없음.",
  "url": "https://www.calai.kr/pdf-rotate",
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
