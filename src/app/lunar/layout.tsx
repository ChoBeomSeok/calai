import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "음력 ↔ 양력 변환 — calai",
  description: "양력 → 음력, 음력 → 양력 + 한국 띠·간지.",
  openGraph: {
    title: "음력 ↔ 양력 변환 | calai",
    description: "양력 → 음력, 음력 → 양력 + 한국 띠·간지.",
    url: "https://calai.kr/lunar",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/lunar" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "음력 ↔ 양력 변환",
  description: "양력 → 음력, 음력 → 양력 + 한국 띠·간지.",
  url: "https://calai.kr/lunar",
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
