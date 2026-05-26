import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix 타임스탬프 변환, KST·UTC·ISO 9가지 동시",
  description: "Unix timestamp를 KST·UTC·ISO·RFC·밀리초·나노초 등 9가지 포맷으로 동시 변환. 어떤 단위든 입력 즉시 양방향.",
  openGraph: {
    title: "타임스탬프 — 9포맷 동시",
    description: "Unix↔날짜 9가지 포맷(KST·UTC·ISO·ms·ns) 동시 변환.",
    url: "https://www.calai.kr/timestamp",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "타임스탬프 — 9포맷 동시",
    description: "Unix↔날짜 9가지 포맷(KST·UTC·ISO·ms·ns) 동시 변환.",
  },
  alternates: { canonical: "https://www.calai.kr/timestamp" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Unix 타임스탬프 변환",
  "description": "Unix timestamp를 KST·UTC·ISO·RFC·밀리초·나노초 등 9가지 포맷으로 동시 변환. 어떤 단위든 입력 즉시 양방향.",
  "url": "https://www.calai.kr/timestamp",
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
