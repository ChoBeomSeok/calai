import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPA 학점 계산기, 4.5·4.3·100점 동시 환산",
  description: "과목명·학점·등급(A+~F)을 입력하면 누적 평점이 4.5·4.3·100점 척도로 동시에. 교환학생·인턴 지원서에 필수.",
  openGraph: {
    title: "GPA — 4.5·4.3·100점 환산",
    description: "과목·학점·등급으로 4.5·4.3·100점 척도 동시 환산.",
    url: "https://www.calai.kr/gpa",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA — 4.5·4.3·100점 환산",
    description: "과목·학점·등급으로 4.5·4.3·100점 척도 동시 환산.",
  },
  alternates: { canonical: "https://www.calai.kr/gpa" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "학점 (GPA) 계산기",
  "description": "과목명·학점·등급(A+~F)을 입력하면 누적 평점이 4.5·4.3·100점 척도로 동시에. 교환학생·인턴 지원서에 필수.",
  "url": "https://www.calai.kr/gpa",
  "applicationCategory": "UtilitiesApplication",
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
