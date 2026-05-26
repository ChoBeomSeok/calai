import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "안전한 비밀번호 생성기, 길이·문자 종류 선택",
  description: "길이와 대·소문자·숫자·특수문자 포함 여부를 선택해 안전한 비밀번호를 즉시 생성. 모든 처리는 브라우저 안에서.",
  openGraph: {
    title: "비밀번호 — 안전한 즉시 생성",
    description: "길이·문자 종류 선택해 안전한 비밀번호 즉시 생성.",
    url: "https://www.calai.kr/password",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "비밀번호 — 안전한 즉시 생성",
    description: "길이·문자 종류 선택해 안전한 비밀번호 즉시 생성.",
  },
  alternates: { canonical: "https://www.calai.kr/password" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "비밀번호 생성기",
  "description": "길이와 대·소문자·숫자·특수문자 포함 여부를 선택해 안전한 비밀번호를 즉시 생성. 모든 처리는 브라우저 안에서.",
  "url": "https://www.calai.kr/password",
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
