import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "팁·N빵 계산기 — calai",
  description: "총액 + 봉사료 + 인원으로 1인당 분담.",
  openGraph: {
    title: "팁·N빵 계산기 | calai",
    description: "총액 + 봉사료 + 인원으로 1인당 분담.",
    url: "https://calai.kr/tip",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/tip" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "팁·N빵 계산기",
  description: "총액 + 봉사료 + 인원으로 1인당 분담.",
  url: "https://calai.kr/tip",
  applicationCategory: "UtilitiesApplication",
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
