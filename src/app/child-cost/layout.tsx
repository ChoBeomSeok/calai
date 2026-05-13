import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자녀 양육비 계산 — calai",
  description: "0~18세 누적 양육비 + 사교육비 시뮬레이션.",
  openGraph: {
    title: "자녀 양육비 계산 | calai",
    description: "0~18세 누적 양육비 + 사교육비 시뮬레이션.",
    url: "https://calai.kr/child-cost",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/child-cost" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "자녀 양육비 계산",
  description: "0~18세 누적 양육비 + 사교육비 시뮬레이션.",
  url: "https://calai.kr/child-cost",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
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
