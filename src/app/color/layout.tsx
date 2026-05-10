import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "색상 변환기 — calai",
  description: "HEX ↔ RGB ↔ HSL 동시 변환 + 미리보기.",
  openGraph: {
    title: "색상 변환기 | calai",
    description: "HEX ↔ RGB ↔ HSL 동시 변환 + 미리보기.",
    url: "https://calai.kr/color",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/color" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "색상 변환기",
  description: "HEX ↔ RGB ↔ HSL 동시 변환 + 미리보기.",
  url: "https://calai.kr/color",
  applicationCategory: "DeveloperApplication",
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
