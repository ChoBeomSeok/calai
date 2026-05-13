import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 일괄 처리 (페이지번호·워터마크·잠금) 무료 | calai",
  description:
    "여러 PDF에 페이지 번호·워터마크·메타 제거·AES-256 비밀번호 잠금을 한 번에. 100장 이상 가능, zip 일괄 다운로드. 100% 브라우저 처리, 가입·워터마크 없음.",
  keywords: [
    "PDF 일괄 처리",
    "PDF 배치 처리",
    "PDF 페이지 번호 일괄",
    "PDF 워터마크 일괄",
    "PDF 일괄 잠금",
    "PDF 메타 일괄 제거",
    "여러 PDF 한 번에",
    "zip 다운로드",
    "smallpdf 일괄",
    "ilovepdf 일괄",
  ],
  openGraph: {
    title: "PDF 일괄 처리 (무료) | calai",
    description: "여러 PDF에 페이지 번호·워터마크·메타 제거·비번 잠금을 한 번에. 100장+ 가능.",
    url: "https://calai.kr/pdf-batch",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 일괄 처리 (무료)",
    description: "여러 PDF에 페이지 번호·워터마크·잠금 일괄.",
  },
  alternates: { canonical: "https://calai.kr/pdf-batch" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 일괄 처리",
  alternateName: ["PDF 배치 처리", "PDF 페이지 번호 일괄"],
  description:
    "여러 PDF에 페이지 번호·워터마크·메타 제거·AES-256 비밀번호 잠금을 한 번에. zip 일괄 다운로드. 100% 브라우저 처리.",
  url: "https://calai.kr/pdf-batch",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Document Batch Processing",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript, WebAssembly. Modern web browser.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
  isAccessibleForFree: true,
  creator: { "@type": "Organization", name: "calai", url: "https://calai.kr" },
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
