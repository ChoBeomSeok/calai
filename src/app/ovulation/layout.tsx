import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "배란일 계산기 — calai",
  description: "마지막 생리일·주기로 배란일·가임기 자동 계산.",
  openGraph: {
    title: "배란일 계산기 | calai",
    description: "마지막 생리일·주기로 배란일·가임기 자동 계산.",
    url: "https://calai.kr/ovulation",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/ovulation" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "배란일 계산기",
  description: "마지막 생리일·주기로 배란일·가임기 자동 계산.",
  url: "https://calai.kr/ovulation",
  applicationCategory: "HealthApplication",
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
