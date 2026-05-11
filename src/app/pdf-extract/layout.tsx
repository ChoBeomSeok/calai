import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 페이지 추출 (무료) — calai",
  description: "PDF에서 원하는 페이지만 무료 추출해 새 파일 생성. 가입·워터마크 없음.",
  openGraph: {
    title: "PDF 페이지 추출 (무료) | calai",
    description: "PDF에서 원하는 페이지만 무료 추출해 새 파일 생성.",
    url: "https://calai.kr/pdf-extract",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/pdf-extract" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 페이지 추출 (무료)",
  description: "PDF에서 원하는 페이지만 무료 추출.",
  url: "https://calai.kr/pdf-extract",
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
