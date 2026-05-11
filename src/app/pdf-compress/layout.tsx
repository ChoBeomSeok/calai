import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 용량 줄이기 (무료) — calai",
  description: "PDF 파일 용량 무료 압축. 이메일 첨부·업로드 한도 회피. 브라우저 내 처리.",
  openGraph: {
    title: "PDF 용량 줄이기 (무료) | calai",
    description: "PDF 파일 용량 무료 압축. 이메일 첨부·업로드 한도 회피.",
    url: "https://calai.kr/pdf-compress",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/pdf-compress" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 용량 줄이기 (무료)",
  description: "PDF 파일 용량 무료 압축. 이메일 첨부 한도 회피.",
  url: "https://calai.kr/pdf-compress",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
