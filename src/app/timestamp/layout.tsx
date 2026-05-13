import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix 타임스탬프 변환 — calai",
  description: "Unix timestamp ↔ 9가지 날짜 포맷. KST·UTC·ISO·RFC·밀리초·나노초 동시 표시.",
  openGraph: {
    title: "Unix 타임스탬프 변환 | calai",
    description: "Unix ↔ 날짜 9가지 포맷. KST·UTC·ISO·RFC·ms·μs·ns.",
    url: "https://calai.kr/timestamp",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/timestamp" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Unix 타임스탬프 변환",
  description: "Unix timestamp ↔ 9가지 날짜 포맷 양방향 변환.",
  url: "https://calai.kr/timestamp",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
