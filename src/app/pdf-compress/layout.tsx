import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 용량 줄이기, 이메일 첨부 한도 회피 무료",
  description: "PDF 파일 용량을 무료로 압축. 이메일 첨부·업로드 한도(10MB·25MB) 회피에 가장 자주 쓰이는 도구. 브라우저 내 처리.",
  openGraph: {
    title: "PDF 압축 — 이메일 첨부 OK",
    description: "PDF 용량 무료 압축, 이메일·업로드 한도 회피용.",
    url: "https://www.calai.kr/pdf-compress",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 압축 — 이메일 첨부 OK",
    description: "PDF 용량 무료 압축, 이메일·업로드 한도 회피용.",
  },
  alternates: { canonical: "https://www.calai.kr/pdf-compress" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 용량 줄이기",
  "description": "PDF 파일 용량을 무료로 압축. 이메일 첨부·업로드 한도(10MB·25MB) 회피에 가장 자주 쓰이는 도구. 브라우저 내 처리.",
  "url": "https://www.calai.kr/pdf-compress",
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
