import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR 코드 생성기, URL·텍스트·Wi-Fi 즉시 다운로드",
  description: "URL·텍스트·Wi-Fi 정보 등을 입력하면 QR 코드가 즉시 생성, PNG·SVG로 바로 다운로드. 명함·포스터·매장 안내에.",
  openGraph: {
    title: "QR 코드 — PNG·SVG 다운",
    description: "URL·텍스트로 QR 즉시 생성, PNG·SVG 다운로드.",
    url: "https://calai.kr/qr-code",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR 코드 — PNG·SVG 다운",
    description: "URL·텍스트로 QR 즉시 생성, PNG·SVG 다운로드.",
  },
  alternates: { canonical: "https://calai.kr/qr-code" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "QR 코드 생성기",
  "description": "URL·텍스트·Wi-Fi 정보 등을 입력하면 QR 코드가 즉시 생성, PNG·SVG로 바로 다운로드. 명함·포스터·매장 안내에.",
  "url": "https://calai.kr/qr-code",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "inLanguage": "ko",
  "isAccessibleForFree": true
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
