import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 합치기 (무료) — calai",
  description: "여러 PDF 파일을 하나로 무료 결합. 가입·워터마크 없음. 브라우저 내 처리로 안전.",
  openGraph: {
    title: "PDF 합치기 (무료) | calai",
    description: "여러 PDF 파일을 하나로 무료 결합. 가입·워터마크 없음.",
    url: "https://calai.kr/pdf-merge",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/pdf-merge" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 합치기 (무료)",
  description: "여러 PDF 파일을 하나로 무료 결합. 가입·워터마크 없음.",
  url: "https://calai.kr/pdf-merge",
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
