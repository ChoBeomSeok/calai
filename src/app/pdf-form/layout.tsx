import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주택임대차계약서 PDF 자동 작성 (무료) | calai",
  description:
    "주택임대차계약서를 본인 정보 입력만으로 한글 PDF 즉시 생성. 보증금·월세·계약기간·특약사항 다 채워서 다운로드. 본인 정보는 100% 브라우저 저장, 서버 전송 X.",
  keywords: [
    "임대차계약서 PDF",
    "주택임대차계약서",
    "임대차 표준계약서",
    "전세계약서 PDF",
    "월세계약서 PDF",
    "한국 PDF 양식",
    "한글 PDF 자동 채우기",
    "임대차계약서 양식",
    "임대차 양식 무료",
  ],
  openGraph: {
    title: "주택임대차계약서 PDF 자동 작성 (무료) | calai",
    description: "본인 정보 입력 → 한글 PDF 즉시 생성. 100% 브라우저 처리.",
    url: "https://calai.kr/pdf-form",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "주택임대차계약서 PDF 자동 작성 (무료)",
    description: "본인 정보 입력 → 한글 PDF 즉시 생성. 브라우저 내 처리.",
  },
  alternates: { canonical: "https://calai.kr/pdf-form" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "주택임대차계약서 PDF 자동 작성",
  alternateName: ["임대차계약서 PDF", "전세계약서 PDF", "월세계약서 PDF"],
  description:
    "주택임대차계약서를 본인 정보 입력만으로 한글 PDF 즉시 생성. 100% 브라우저 처리, 서버 전송 X.",
  url: "https://calai.kr/pdf-form",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Contract Form Generator",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Modern web browser.",
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
