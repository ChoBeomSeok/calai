import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "해시 생성기, MD5·SHA·HMAC 텍스트·파일 동시",
  description: "텍스트나 파일을 넣으면 MD5·SHA-1·SHA-256·SHA-384·SHA-512가 동시에. HMAC 서명까지, 파일 무결성·체크섬에.",
  openGraph: {
    title: "해시 — MD5·SHA·HMAC",
    description: "텍스트·파일을 MD5·SHA·HMAC 동시 생성, 무결성 검증용.",
    url: "https://www.calai.kr/hash",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "해시 — MD5·SHA·HMAC",
    description: "텍스트·파일을 MD5·SHA·HMAC 동시 생성, 무결성 검증용.",
  },
  alternates: { canonical: "https://www.calai.kr/hash" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "해시 생성기 (MD5·SHA·HMAC)",
  "description": "텍스트나 파일을 넣으면 MD5·SHA-1·SHA-256·SHA-384·SHA-512가 동시에. HMAC 서명까지, 파일 무결성·체크섬에.",
  "url": "https://www.calai.kr/hash",
  "applicationCategory": "DeveloperApplication",
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
