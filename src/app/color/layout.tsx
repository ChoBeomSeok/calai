import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "색상 변환기, HEX·RGB·HSL 동시 + 미리보기",
  description: "HEX·RGB·HSL 어느 값이든 입력하면 나머지가 즉시 변환되고 실제 색상이 미리보기로. 디자이너·개발자 일상 도구.",
  openGraph: {
    title: "색상 변환 — HEX·RGB·HSL",
    description: "HEX·RGB·HSL 동시 변환 + 색상 미리보기 한 페이지.",
    url: "https://www.calai.kr/color",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "색상 변환 — HEX·RGB·HSL",
    description: "HEX·RGB·HSL 동시 변환 + 색상 미리보기 한 페이지.",
  },
  alternates: { canonical: "https://www.calai.kr/color" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "색상 변환기",
  "description": "HEX·RGB·HSL 어느 값이든 입력하면 나머지가 즉시 변환되고 실제 색상이 미리보기로. 디자이너·개발자 일상 도구.",
  "url": "https://www.calai.kr/color",
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
