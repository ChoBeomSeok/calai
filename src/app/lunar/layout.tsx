import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "음력 ↔ 양력 변환, 띠·간지까지 한 번에",
  description: "양력 → 음력, 음력 → 양력 양방향 변환 + 그 해의 띠와 간지(육십갑자)까지 동시 표시. 생일·제사·길일 확인용.",
  openGraph: {
    title: "음력 양력 — 띠·간지 동시",
    description: "양력↔음력 양방향 + 띠·간지(육십갑자) 한 번에 표시.",
    url: "https://www.calai.kr/lunar",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "음력 양력 — 띠·간지 동시",
    description: "양력↔음력 양방향 + 띠·간지(육십갑자) 한 번에 표시.",
  },
  alternates: { canonical: "https://www.calai.kr/lunar" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "음력 ↔ 양력 변환",
  "description": "양력 → 음력, 음력 → 양력 양방향 변환 + 그 해의 띠와 간지(육십갑자)까지 동시 표시. 생일·제사·길일 확인용.",
  "url": "https://www.calai.kr/lunar",
  "applicationCategory": "UtilitiesApplication",
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
