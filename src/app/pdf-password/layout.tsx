import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 비밀번호 잠금·해제 AES-256 (무료) | calai",
  description:
    "PDF에 AES-256/128 표준 암호 잠금 또는 비밀번호 알고 있는 PDF 해제. qpdf 엔진 기반, Adobe·Chrome·미리보기 모두 호환. 100% 브라우저 처리, 가입·워터마크 없음.",
  keywords: [
    "PDF 비밀번호",
    "PDF 암호화",
    "PDF 잠금",
    "PDF 비밀번호 해제",
    "PDF 비밀번호 풀기",
    "AES-256 PDF",
    "PDF 보안",
    "PDF protect",
    "smallpdf 무료",
    "qpdf",
  ],
  openGraph: {
    title: "PDF 비밀번호 잠금·해제 AES-256 (무료) | calai",
    description: "AES-256/128 표준 PDF 잠금·해제. 모든 PDF 뷰어 호환, 100% 브라우저 처리.",
    url: "https://calai.kr/pdf-password",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 비밀번호 잠금·해제 (무료)",
    description: "AES-256/128 표준 잠금·해제. 브라우저 내 처리.",
  },
  alternates: { canonical: "https://calai.kr/pdf-password" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF 비밀번호 잠금·해제",
  alternateName: ["PDF 암호화", "PDF 잠금", "PDF 비밀번호 풀기"],
  description:
    "PDF에 AES-256/128 표준 암호 잠금 또는 비밀번호 알고 있는 PDF 해제. qpdf 엔진 기반, 모든 표준 PDF 리더 호환. 100% 브라우저 처리.",
  url: "https://calai.kr/pdf-password",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Document Security",
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
