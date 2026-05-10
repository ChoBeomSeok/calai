import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "양도소득세 계산기 — calai",
  description: "1주택·다주택 양도세 + 보유·거주별 공제.",
  openGraph: {
    title: "양도소득세 계산기 | calai",
    description: "1주택·다주택 양도세 + 보유·거주별 공제.",
    url: "https://calai.kr/capital-gains",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/capital-gains" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "양도소득세 계산기",
  description: "1주택·다주택 양도세 + 보유·거주별 공제.",
  url: "https://calai.kr/capital-gains",
  applicationCategory: "BusinessApplication",
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
