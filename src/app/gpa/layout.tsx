import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "학점 (GPA) 계산기 — calai",
  description: "과목·학점·등급으로 누적 평점 4.5/4.3/100점.",
  openGraph: {
    title: "학점 (GPA) 계산기 | calai",
    description: "과목·학점·등급으로 누적 평점 4.5/4.3/100점.",
    url: "https://calai.kr/gpa",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://calai.kr/gpa" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "학점 (GPA) 계산기",
  description: "과목·학점·등급으로 누적 평점 4.5/4.3/100점.",
  url: "https://calai.kr/gpa",
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
