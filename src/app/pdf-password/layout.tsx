import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 비밀번호 잠금·해제, AES-256 무료",
  description: "PDF를 AES-256/128 표준으로 암호화 잠금하거나 비밀번호를 알고 있는 PDF의 잠금을 해제. qpdf 엔진 기반, 무료.",
  openGraph: {
    title: "PDF 잠금·해제 — AES-256",
    description: "PDF AES-256 잠금/비번 알고 있는 PDF 해제 무료.",
    url: "https://www.calai.kr/pdf-password",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 잠금·해제 — AES-256",
    description: "PDF AES-256 잠금/비번 알고 있는 PDF 해제 무료.",
  },
  alternates: { canonical: "https://www.calai.kr/pdf-password" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PDF 비밀번호 잠금·해제",
  "description": "PDF를 AES-256/128 표준으로 암호화 잠금하거나 비밀번호를 알고 있는 PDF의 잠금을 해제. qpdf 엔진 기반, 무료.",
  "url": "https://www.calai.kr/pdf-password",
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
