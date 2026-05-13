import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR 코드 생성기 — calai",
  description: "URL·텍스트 → QR 코드 즉시 생성, 다운로드 가능.",
  openGraph: {
    title: "QR 코드 생성기 | calai",
    description: "URL·텍스트 → QR 코드 즉시 생성, 다운로드 가능.",
    url: "https://calai.kr/qr-code",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "https://calai.kr/qr-code" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "QR 코드 생성기",
  description: "URL·텍스트 → QR 코드 즉시 생성, 다운로드 가능.",
  url: "https://calai.kr/qr-code",
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
