import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "중개수수료 계산기 — calai",
  description: "매매·전세·월세 거래액별 법정 한도.",
  openGraph: {
    title: "중개수수료 계산기 | calai",
    description: "매매·전세·월세 거래액별 법정 한도.",
    url: "https://calai.kr/agent-fee",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/agent-fee" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "중개수수료 계산기",
  description: "매매·전세·월세 거래액별 법정 한도.",
  url: "https://calai.kr/agent-fee",
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
