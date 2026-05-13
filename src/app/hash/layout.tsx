import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "해시 생성기 MD5·SHA-1·SHA-256·SHA-512·HMAC (무료) | calai",
  description:
    "텍스트·파일 → MD5·SHA-1·SHA-256·SHA-384·SHA-512 동시 생성. HMAC 서명 지원. 파일 무결성·체크섬 검증·API 서명용. 100% 브라우저 처리, 서버 전송 X.",
  keywords: [
    "해시 생성기",
    "MD5 계산기",
    "SHA-256 생성",
    "SHA-1 생성",
    "SHA-512 생성",
    "HMAC 서명",
    "파일 해시",
    "체크섬 검증",
    "Web Crypto API",
    "파일 무결성",
  ],
  openGraph: {
    title: "해시 생성기 — MD5·SHA·HMAC | calai",
    description: "텍스트·파일 동시 해시 + HMAC 서명. 파일 무결성·체크섬·API 서명. 100% 브라우저 처리.",
    url: "https://calai.kr/hash",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "해시 생성기 (MD5·SHA·HMAC)",
    description: "텍스트·파일 동시 해시 + HMAC. 브라우저 내 처리.",
  },
  alternates: { canonical: "https://calai.kr/hash" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "해시 생성기 (MD5·SHA·HMAC)",
  alternateName: ["MD5 계산기", "SHA-256 생성기", "HMAC 서명"],
  description:
    "텍스트·파일 → MD5·SHA-1·SHA-256·SHA-384·SHA-512 동시 생성 + HMAC 서명. 파일 무결성·체크섬·API 서명용. 100% 브라우저 처리.",
  url: "https://calai.kr/hash",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Cryptography Tool",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Modern web browser with Web Crypto API.",
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
