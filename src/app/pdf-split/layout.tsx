import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 분할, 페이지 단위로 자르기 무료 즉시",
  description: "PDF 한 파일을 페이지 단위·범위 지정으로 무료 분할. 파일은 브라우저 안에서만 처리, 가입·설치·워터마크 없음.",
  openGraph: {
    title: "PDF 분할 — 페이지·범위 지정",
    description: "PDF를 페이지 단위·범위 지정으로 무료 분할, 외부 전송 X.",
    url: "https://www.calai.kr/pdf-split",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 분할 — 페이지·범위 지정",
    description: "PDF를 페이지 단위·범위 지정으로 무료 분할, 외부 전송 X.",
  },
  alternates: { canonical: "https://www.calai.kr/pdf-split" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 분할",
  "description": "PDF 한 파일을 페이지 단위·범위 지정으로 무료 분할. 파일은 브라우저 안에서만 처리, 가입·설치·워터마크 없음.",
  "url": "https://www.calai.kr/pdf-split",
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
