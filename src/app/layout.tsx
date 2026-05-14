import type { Metadata } from "next";
import { Roboto, Playfair_Display, Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  // Vercel 도메인 설정상 www.calai.kr가 primary이고 calai.kr는 → www 307 redirect.
  // 일부 크롤러가 redirect를 따라가지 못해 OG 이미지를 못 가져가는 문제를 회피하기 위해
  // 메타 기반 URL을 처음부터 www로 생성.
  metadataBase: new URL("https://www.calai.kr"),
  title: {
    default: "calai — 한국에서 가장 빠른 도구·계산기 106개",
    template: "%s | calai",
  },
  description:
    "BMI·대출·적금·양도세·만 나이·연봉 실수령액·평수 변환·청약 가점·LTV/DTI·JSON 포매터 등 106개 도구를 한 페이지에 모았습니다. 가입·로그인 없이 무료로 즉시 사용.",
  keywords: [
    "계산기", "도구", "BMI", "대출 이자", "적금 만기", "양도세", "취득세",
    "만 나이", "연봉 실수령액", "평수 변환", "청약 가점", "LTV", "DTI",
    "전기요금", "자동차세", "JSON 포매터", "Base64", "JWT 디코더",
    "PDF 합치기", "PDF 분할", "PDF 압축", "PDF 회전", "이미지 PDF 변환",
    "PDF 워터마크", "무료 PDF", "JPG PDF 변환",
    "글자수 세기", "자소서 글자수", "증명사진 만들기", "여권사진",
    "이미지 압축", "실업급여 계산기", "구직급여", "전세 사기 위험도",
    "깡통전세 진단", "전세가율 계산",
    "마크다운 변환", "MD to HTML", "MD to PDF",
    "타임스탬프 변환", "Unix timestamp", "epoch",
    "Cron 표현식", "크론 해석",
    "SQL 포매터", "SQL beautify",
    "한국에서 몇 번째", "한국 순위", "같은 이름", "같은 생일 동기",
    "누적 출생 순번", "한국 키 분위", "성씨 인구", "동기 동명이인",
    "CSV JSON 변환", "CSV to JSON", "JSON to CSV", "엑셀 JSON 변환",
    "해시 생성기", "MD5 계산기", "SHA-256 생성", "HMAC 서명", "파일 무결성 검증",
    "메타데이터 제거", "EXIF 제거", "GPS 정보 제거", "PDF 작성자 제거", "익명화",
    "PDF 서명", "PDF 전자서명", "손글씨 서명", "DocuSign 무료",
    "PDF 비밀번호", "PDF 암호화", "PDF 잠금", "AES-256 PDF", "qpdf",
    "PDF 일괄 처리", "PDF 배치", "PDF 페이지 번호 일괄", "PDF 워터마크 일괄",
  ],
  authors: [{ name: "calai" }],
  openGraph: {
    title: "calai — 한국에서 가장 빠른 도구·계산기 106개",
    description:
      "BMI·대출·적금·양도세·만 나이·평수 변환 등 106개 도구를 한 페이지에. 가입 없이 무료.",
    url: "https://calai.kr",
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "calai — 한국에서 가장 빠른 도구·계산기 106개",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "calai — 한국에서 가장 빠른 도구·계산기",
    description: "106개 도구를 한 페이지에. 가입 없이 무료.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "https://calai.kr" },
  verification: {
    google: "iyjeJCSlVSqTzjmxJvyg1JJy5dSfCcf5pjtdnjLoMp4",
    other: {
      "naver-site-verification": "bdf46184407524f311663c9de99af8d7c80daf48",
    },
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "calai",
  url: "https://calai.kr",
  inLanguage: "ko",
  description:
    "BMI·대출·적금·양도세·만 나이·평수 변환 등 106개 한국 도구·계산기를 한 페이지에 모은 사이트.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://calai.kr/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "calai",
  url: "https://calai.kr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full ${roboto.variable} ${playfair.variable} ${notoSerifKR.variable} ${notoSansKR.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('calai-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
