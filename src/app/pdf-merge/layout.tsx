import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 합치기, 설치 없이 10초 만에 끝내는 무료",
  description: "여러 PDF 파일을 드래그 한 번으로 결합. 파일이 서버로 전송되지 않아 안전합니다. 가입·설치·워터마크 없이 즉시 다운로드.",
  openGraph: {
    title: "PDF 합치기 — 설치 없이 10초",
    description: "여러 PDF를 드래그로 결합, 가입·워터마크 없이 즉시 다운로드.",
    url: "https://www.calai.kr/pdf-merge",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 합치기 — 설치 없이 10초",
    description: "여러 PDF를 드래그로 결합, 가입·워터마크 없이 즉시 다운로드.",
  },
  alternates: { canonical: "https://www.calai.kr/pdf-merge" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 합치기",
  "description": "여러 PDF 파일을 드래그 한 번으로 결합. 파일이 서버로 전송되지 않아 안전합니다. 가입·설치·워터마크 없이 즉시 다운로드.",
  "url": "https://www.calai.kr/pdf-merge",
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
