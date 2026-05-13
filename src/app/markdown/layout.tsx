import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마크다운 미리보기·변환 — calai",
  description: "Markdown → HTML 실시간 미리보기 + HTML·PDF 다운로드. GFM (표·체크리스트·코드 하이라이팅) 지원.",
  openGraph: {
    title: "마크다운 미리보기·변환 | calai",
    description: "Markdown → HTML 실시간 미리보기 + HTML·PDF 다운로드. GFM 지원.",
    url: "https://calai.kr/markdown",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/markdown" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "마크다운 미리보기·변환",
  description: "Markdown → HTML/PDF 실시간 변환. GFM 지원.",
  url: "https://calai.kr/markdown",
  applicationCategory: "DeveloperApplication",
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
