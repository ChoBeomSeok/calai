import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "복리 계산기 — calai",
  description: "원금·이율·기간·복리 주기로 미래 가치.",
  openGraph: {
    title: "복리 계산기 | calai",
    description: "원금·이율·기간·복리 주기로 미래 가치.",
    url: "https://calai.kr/compound",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/compound" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "복리 계산기",
  description: "원금·이율·기간·복리 주기로 미래 가치.",
  url: "https://calai.kr/compound",
  applicationCategory: "FinanceApplication",
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
