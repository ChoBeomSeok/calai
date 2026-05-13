import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 회전 (무료) — calai",
  description: "PDF 페이지 90·180·270도 무료 회전. 가로·세로 정렬. 브라우저 내 처리.",
  openGraph: {
    title: "PDF 회전 (무료) | calai",
    description: "PDF 페이지 90·180·270도 무료 회전.",
    url: "https://calai.kr/pdf-rotate",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/pdf-rotate" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 회전 (무료)",
  description: "PDF 페이지 90·180·270도 무료 회전.",
  url: "https://calai.kr/pdf-rotate",
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
