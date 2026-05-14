import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 인코딩·디코딩, 한글 깨짐 없이 양방향",
  description: "문자열과 Base64를 양쪽에서 실시간 변환. UTF-8 한글·이모지 깨짐 없음, 입력값은 브라우저 밖으로 나가지 않습니다.",
  openGraph: {
    title: "Base64 — 한글 OK 양방향",
    description: "문자열↔Base64 실시간, 한글·이모지 깨짐 없이 변환.",
    url: "https://calai.kr/base64",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 — 한글 OK 양방향",
    description: "문자열↔Base64 실시간, 한글·이모지 깨짐 없이 변환.",
  },
  alternates: { canonical: "https://calai.kr/base64" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Base64 인코딩·디코딩",
  "description": "문자열과 Base64를 양쪽에서 실시간 변환. UTF-8 한글·이모지 깨짐 없음, 입력값은 브라우저 밖으로 나가지 않습니다.",
  "url": "https://calai.kr/base64",
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
