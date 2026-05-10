# calai — 한국에서 가장 빠른 도구·계산기 80개

🌐 **[calai.kr](https://calai.kr)** — 가입·로그인 없이 즉시 사용하는 무료 한국어 도구 모음

[![Live](https://img.shields.io/badge/Live-calai.kr-4f46e5?style=flat-square)](https://calai.kr)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

## 🎯 주요 기능

한국 사용자가 자주 검색하는 **80개 도구**를 한 페이지에 모았습니다. 모든 계산은 브라우저에서 처리되어 빠르고 안전합니다.

### 카테고리별 도구

| 카테고리 | 주요 도구 | 개수 |
|---------|---------|------|
| 💰 **금융** | [대출이자](https://calai.kr/loan) · [적금만기](https://calai.kr/savings) · [연봉실수령](https://calai.kr/salary) · [복리](https://calai.kr/compound) · [환율](https://calai.kr/exchange) · [코인손익](https://calai.kr/coin-pl) | 14 |
| 🏠 **부동산** | [양도세](https://calai.kr/capital-gains) · [취득세](https://calai.kr/acquisition-tax) · [청약가점](https://calai.kr/cheongyak-score) · [LTV·DTI](https://calai.kr/ltv-dti) · [재산세](https://calai.kr/property-tax) · [전월세전환](https://calai.kr/jeonse-monthly) | 8 |
| 🧾 **세금** | [종합소득세](https://calai.kr/income-tax) · [부가세](https://calai.kr/vat) · [상속세](https://calai.kr/inheritance-tax) · [증여세](https://calai.kr/gift-tax) · [퇴직금](https://calai.kr/severance) · [종부세](https://calai.kr/comprehensive-property-tax) | 6 |
| 🚗 **자동차** | [자동차세](https://calai.kr/car-tax) · [주유비](https://calai.kr/fuel-cost) · [자동차할부](https://calai.kr/car-loan) · [톨비](https://calai.kr/toll-fee) · [전기차충전](https://calai.kr/ev-charge) | 6 |
| 🏃 **건강** | [BMI](https://calai.kr/bmi) · [칼로리](https://calai.kr/calorie) · [임신주차](https://calai.kr/pregnancy) · [배란일](https://calai.kr/ovulation) · [1RM](https://calai.kr/one-rm) · [수면시간](https://calai.kr/sleep) | 13 |
| 📅 **일상** | [만나이](https://calai.kr/age) · [D-Day](https://calai.kr/dday) · [평수변환](https://calai.kr/pyeong) · [전기요금](https://calai.kr/electricity) · [세계시간](https://calai.kr/timezone) · [로또번호](https://calai.kr/lotto) | 17 |
| 💻 **개발자** | [비밀번호](https://calai.kr/password) · [UUID](https://calai.kr/uuid) · [JSON 포매터](https://calai.kr/json-format) · [JWT 디코더](https://calai.kr/jwt-decode) · [Base64](https://calai.kr/base64) · [AI 토큰비용](https://calai.kr/ai-token) | 11 |
| 💕 **라이프** | [MBTI 궁합](https://calai.kr/mbti-compatibility) · [결혼비용](https://calai.kr/wedding-cost) · [자녀양육비](https://calai.kr/child-cost) · [탄소발자국](https://calai.kr/carbon-footprint) | 5 |

## ✨ 차별점

- **빠른 로딩** — Next.js 16 정적 사이트, 0.3~1초 안 페이지 표시
- **실시간 데이터** — 환율(ECB)·코인 시세(업비트)·세계 시간 자동 갱신
- **한국 특화** — 청약 가점·LTV/DTI·취득세·종부세·만 나이 등 한국 사용자 전용
- **개인정보 보호** — 모든 계산은 브라우저에서 처리, 서버 전송 X
- **광고 최소화** — 도구 사용을 방해하지 않는 위치·빈도

## 🛠 기술 스택

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, src directory)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) (다크모드 지원)
- **Deployment**: [Vercel](https://vercel.com) (자동 배포)
- **Analytics**: Google Analytics 4 + Search Console + Naver Search Advisor
- **APIs**: ECB Reference Rates (환율) · Upbit (코인 시세)

## 🚀 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build && npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기.

## 📂 프로젝트 구조

```
src/
├── app/                # 80개 도구 페이지 (Next.js App Router)
│   ├── bmi/            # /bmi 도구
│   ├── salary/         # /salary 도구
│   ├── ...
│   └── api/            # 환율·코인 API 프록시
├── components/         # 공통 컴포넌트 (CalculatorLayout, ToolGuide, MoneyHint)
└── lib/
    ├── tools.ts        # 80개 도구 메타데이터
    ├── toolGuides.ts   # 도구별 가이드·FAQ·실제 사례
    └── mbtiAnalysis.ts # MBTI 궁합 분석 라이브러리
```

## 📊 SEO 최적화

- **JSON-LD**: WebSite · Organization · WebApplication · FAQPage · BreadcrumbList
- **Sitemap**: 자동 생성 (`/sitemap.xml`)
- **OpenGraph**: 동적 OG 이미지
- **PWA**: manifest + 홈 화면 추가 가능

## 📬 문의·제안

- 🌐 **사이트**: [calai.kr](https://calai.kr)
- ✉️ **이메일**: petandme99@gmail.com
- 📝 **문의**: [calai.kr/contact](https://calai.kr/contact)

## 📄 라이선스

MIT License — 자유롭게 사용·수정·배포 가능
