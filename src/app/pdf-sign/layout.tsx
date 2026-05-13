import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 손글씨 서명 (무료) — DocuSign 없이 즉시 | calai",
  description:
    "PDF에 손글씨 서명 추가 무료. 마우스·터치·펜 압력 인식, 정확한 위치 드래그·리사이즈. 임대차·근로계약·동의서에 즉시 사용. 100% 브라우저 처리, 가입·워터마크 없음.",
  keywords: [
    "PDF 서명",
    "PDF 전자서명",
    "손글씨 서명",
    "PDF sign",
    "임대차계약 서명",
    "근로계약 서명",
    "DocuSign 무료",
    "전자서명 무료",
    "PDF 사인",
    "PDF 서명 추가",
  ],
  openGraph: {
    title: "PDF 손글씨 서명 (무료) | calai",
    description: "마우스·터치·펜으로 PDF에 즉시 서명. 100% 브라우저 처리, 가입 없음.",
    url: "https://calai.kr/pdf-sign",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 손글씨 서명 (무료)",
    description: "임대차·근로계약·동의서에 즉시. 브라우저 내 처리.",
  },
  alternates: { canonical: "https://calai.kr/pdf-sign" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 손글씨 서명",
  alternateName: ["PDF 전자서명", "PDF sign", "PDF 사인"],
  description:
    "PDF에 손글씨 서명 추가. 마우스·터치·펜 압력 인식, 드래그·리사이즈로 정확한 위치 배치. 임대차·근로계약·동의서에 즉시 사용. 100% 브라우저 처리.",
  url: "https://calai.kr/pdf-sign",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Document Signing",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Modern web browser with PointerEvent support.",
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
