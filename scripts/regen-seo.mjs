#!/usr/bin/env node
// 104개 도구 layout.tsx의 SEO 메타데이터를 일괄 갱신.
// 실행: node scripts/regen-seo.mjs

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APP_DIR = join(ROOT, "src", "app");

/**
 * @typedef {Object} SeoEntry
 * @property {string} title       메인 검색용 (root template "%s | calai" 자동 부착)
 * @property {string} description 메타 설명 (80~150자)
 * @property {string} ogTitle     OG/Twitter 제목 (18~30자, 짧고 임팩트)
 * @property {string} ogDescription OG/Twitter 설명 (60~90자)
 * @property {string} name        schema.org WebApplication name
 * @property {string} appCategory schema.org applicationCategory
 */

/** @type {Record<string, SeoEntry>} */
const SEO = {
  // ───────── 건강 ─────────
  "bmi": {
    title: "BMI 계산기, 키·체중 입력만으로 비만도 즉시 진단",
    description: "키·체중 두 칸이면 BMI 지수와 비만 단계가 한 번에. 한국 비만학회 + WHO 기준을 나란히 비교, 표준체중까지 함께 안내. 가입·설치 없이 무료.",
    ogTitle: "BMI 계산 — 한국·WHO 기준 동시 비교",
    ogDescription: "키·체중만 넣으면 BMI와 비만 단계 즉시. 한국·WHO 기준 함께 표시.",
    name: "BMI 계산기",
    appCategory: "HealthApplication",
  },
  "calorie": {
    title: "칼로리 계산기, BMR·TDEE 한 번에 다이어트 권장량까지",
    description: "기초대사량(BMR)과 일일 소모 칼로리(TDEE)를 즉시 산출. 다이어트·유지·벌크업 목표별 권장 섭취량을 한 페이지에. 가입 없이 무료.",
    ogTitle: "칼로리 계산 — BMR·TDEE 즉시",
    ogDescription: "BMR·TDEE 자동 산출 + 다이어트·유지·벌크업 권장량까지 한눈에.",
    name: "칼로리 계산기 (BMR·TDEE)",
    appCategory: "HealthApplication",
  },
  "standard-weight": {
    title: "표준 체중 계산기, 키·성별로 적정 체중 즉시",
    description: "키·성별만 입력하면 브로카·로러 공식으로 표준 체중과 적정 범위를 자동 산출. 현재 체중과 비교한 비만도도 함께 표시.",
    ogTitle: "표준 체중 — 키·성별로 적정 범위",
    ogDescription: "브로카·로러 공식 표준 체중 + 비만도 비교까지 한 번에.",
    name: "표준 체중 계산기",
    appCategory: "HealthApplication",
  },
  "pregnancy": {
    title: "임신 주차 계산기, 출산 예정일·태교 시기까지 자동",
    description: "마지막 생리일만 넣으면 현재 임신 주차, 출산 예정일, 태교·검진 시기가 한눈에. 산모수첩 없이도 즉시 확인.",
    ogTitle: "임신 주차 — 출산 예정일 자동",
    ogDescription: "마지막 생리일로 주차·출산일·태교 시기 즉시 확인.",
    name: "임신 주차 계산기",
    appCategory: "HealthApplication",
  },
  "ovulation": {
    title: "배란일 계산기, 가임기까지 한 달치 자동 표시",
    description: "마지막 생리일과 주기를 넣으면 배란일과 가임기(가임 가능성 높은 5일)를 달력 형태로 자동 표시. 임신 준비·피임 계획에.",
    ogTitle: "배란일 — 가임기 5일 한눈에",
    ogDescription: "생리 주기로 배란일·가임기 자동, 달력 형태로 확인.",
    name: "배란일 계산기",
    appCategory: "HealthApplication",
  },
  "alcohol": {
    title: "음주 후 운전 가능 시간, 성별·체중으로 정확히",
    description: "성별·체중·음주량·시간으로 혈중 알코올 농도와 운전 가능 시간을 추정. 위드마크 공식 기반, 다음날 새벽 운전 전 필수 체크.",
    ogTitle: "음주 후 운전 가능 시간 추정",
    ogDescription: "위드마크 공식으로 체중·음주량별 운전 가능 시간 계산.",
    name: "음주 알코올 분해 시간",
    appCategory: "HealthApplication",
  },
  "one-rm": {
    title: "1RM 계산기, 든 무게·횟수로 최대 중량 추정",
    description: "들어올린 무게와 횟수로 1회 최대 중량(1RM)을 즉시 추정. 에프리·브제츠키·랜더 공식을 동시에 비교, 헬스 목표 설정에.",
    ogTitle: "1RM 추정 — 무게·횟수만 입력",
    ogDescription: "3가지 공식 비교로 1RM 추정, 헬스 루틴 짤 때 필수.",
    name: "1RM 계산기",
    appCategory: "HealthApplication",
  },
  "marathon-pace": {
    title: "마라톤 페이스 계산기, 목표 시간으로 km당 분 자동",
    description: "5km·10km·하프·풀 마라톤의 목표 완주 시간을 넣으면 km당 페이스와 구간별 통과 시간이 자동. 대회 전 페이스 전략에.",
    ogTitle: "마라톤 페이스 — km당 분 자동",
    ogDescription: "목표 완주 시간으로 km당 페이스·구간 통과 시간 자동.",
    name: "마라톤 페이스 계산기",
    appCategory: "HealthApplication",
  },
  "mountain-time": {
    title: "등산 시간 계산기, 거리·고도로 정확한 코스 시간",
    description: "거리와 누적 고도만 입력하면 Naismith·Tobler 공식으로 예상 등산 시간을 추정. 들머리부터 정상까지 무리 없는 코스 계획에.",
    ogTitle: "등산 시간 — 거리·고도로 추정",
    ogDescription: "Naismith·Tobler 공식으로 코스 예상 시간 자동.",
    name: "등산 시간 계산기",
    appCategory: "HealthApplication",
  },
  "water-intake": {
    title: "하루 물 섭취량, 체중·활동량으로 권장량 즉시",
    description: "체중·활동량·기온을 반영해 하루 권장 수분 섭취량을 자동 산출. ml·잔 단위 동시 표시로 컵 갯수까지 한눈에.",
    ogTitle: "하루 물 권장량 — 체중 기준",
    ogDescription: "체중·활동량 반영해 ml·잔 단위로 동시 표시.",
    name: "수분 섭취량 계산기",
    appCategory: "HealthApplication",
  },
  "sleep": {
    title: "수면 시간 계산기, 기상 시간에서 거꾸로 90분 사이클",
    description: "기상하고 싶은 시간을 넣으면 90분 수면 사이클 기준 추천 취침 시간 4~5개를 자동 제시. 가벼운 기상에 도움.",
    ogTitle: "수면 사이클 — 90분 단위 추천",
    ogDescription: "기상 시간 기준 90분 사이클로 취침 시간 자동 추천.",
    name: "수면 시간 계산기",
    appCategory: "HealthApplication",
  },
  "child-height": {
    title: "자녀 키 예측, 부모 키로 성인 예상 신장",
    description: "아빠·엄마 키와 자녀 성별을 넣으면 Tanner 공식으로 자녀의 예상 성인 신장을 자동 산출. 성장 곡선 참고용.",
    ogTitle: "자녀 키 예측 — 부모 키 기준",
    ogDescription: "Tanner 공식으로 자녀의 예상 성인 키 자동 산출.",
    name: "어린이 키 예측",
    appCategory: "HealthApplication",
  },
  "heart-rate": {
    title: "운동 강도 심박수, 나이로 최대·구간별 자동",
    description: "나이만 입력하면 최대 심박수와 운동 강도 50~85% 구간별 심박수가 한눈에. 유산소·인터벌·근력 목표 강도 설정에.",
    ogTitle: "운동 심박수 — 강도별 구간 표",
    ogDescription: "나이 기준 최대·구간별(50~85%) 심박수 자동 표시.",
    name: "심박수 운동 강도",
    appCategory: "HealthApplication",
  },

  // ───────── 금융 ─────────
  "loan": {
    title: "대출 이자 계산기, 원리금·원금·만기 일시 3가지 비교",
    description: "대출 원금·이율·기간을 넣으면 원리금 균등·원금 균등·만기 일시 3가지 방식의 월 상환액과 총 이자를 한 화면에서 비교.",
    ogTitle: "대출 이자 — 3가지 상환 방식 비교",
    ogDescription: "원리금·원금·만기 일시 방식의 월 상환액·총 이자 동시 비교.",
    name: "대출 이자 계산기",
    appCategory: "FinanceApplication",
  },
  "savings": {
    title: "적금 만기 계산기, 만기 수령액·세후 실수령까지",
    description: "월 적립액·금리·기간을 넣으면 만기 수령액과 이자소득세 15.4% 차감 실수령액이 한 번에. 단리·복리 동시 비교.",
    ogTitle: "적금 만기 — 세후 실수령 즉시",
    ogDescription: "월 적립액·금리·기간으로 만기 수령액과 세후 실수령 자동.",
    name: "적금 만기 계산기",
    appCategory: "FinanceApplication",
  },
  "compound": {
    title: "복리 계산기, 원금·이율·복리 주기로 미래 가치",
    description: "원금·연이율·기간·복리 주기(연·반기·분기·월·일)를 선택하면 시간에 따른 자산 증가 그래프와 미래 가치가 자동 표시.",
    ogTitle: "복리 — 미래 가치·증가 그래프",
    ogDescription: "원금·이율·기간 + 복리 주기 5가지 자동 미래 가치 계산.",
    name: "복리 계산기",
    appCategory: "FinanceApplication",
  },
  "salary": {
    title: "연봉 실수령액 계산기, 4대보험·세금 차감 후 월급",
    description: "연봉만 넣으면 국민연금·건강·고용·산재 4대보험과 소득세·지방세를 차감한 실제 월 실수령액이 즉시. 2026년 기준 반영.",
    ogTitle: "연봉 실수령액 — 월 손에 쥐는 돈",
    ogDescription: "4대보험·세금 차감 후 실제 월 실수령액 즉시 계산.",
    name: "연봉 실수령액 계산기",
    appCategory: "FinanceApplication",
  },
  "exchange": {
    title: "환율 변환기, 실시간 USD·JPY·EUR·CNY 원화 변환",
    description: "실시간 환율 기반으로 달러·엔·유로·위안 등 주요 통화를 원화로 즉시 변환. 환율 우대 비교용 베이스 데이터로도 활용.",
    ogTitle: "환율 변환 — 실시간 주요 통화",
    ogDescription: "USD·JPY·EUR·CNY 등 주요 통화의 실시간 원화 변환.",
    name: "환율 변환기",
    appCategory: "FinanceApplication",
  },
  "installment": {
    title: "신용카드 할부 계산기, 월 청구액·총 수수료까지",
    description: "할부 원금·개월수·수수료율을 넣으면 매월 청구되는 금액과 누적 수수료가 즉시. 무이자 할부와의 차액 비교에 유용.",
    ogTitle: "카드 할부 — 월 청구·수수료",
    ogDescription: "원금·개월·수수료율로 매월 청구액과 총 수수료 자동.",
    name: "신용카드 할부 계산기",
    appCategory: "FinanceApplication",
  },
  "stock-average": {
    title: "주식 평단가 계산기, 추가 매수 후 평균 단가 즉시",
    description: "기존 보유 주식과 추가 매수 수량·가격을 넣으면 새로운 평균 매수 단가가 즉시. 물타기·불타기 전후 손익 시뮬레이션에.",
    ogTitle: "주식 평단가 — 추가 매수 후 평균",
    ogDescription: "기존 보유 + 추가 매수로 평균 단가 자동, 물타기 시뮬레이션.",
    name: "주식 평단가 계산기",
    appCategory: "FinanceApplication",
  },
  "coin-average": {
    title: "코인 평단가 계산기, 추가 매수 후 평균 매수가",
    description: "기존 보유 코인 수량·평단과 추가 매수 정보를 넣으면 새 평균 매수가가 즉시. 비트코인·이더리움 등 모든 코인 공통.",
    ogTitle: "코인 평단가 — 추가 매수 후 평균",
    ogDescription: "보유 + 추가 매수로 코인 평균 매수가 자동 산출.",
    name: "가상화폐 평단가",
    appCategory: "FinanceApplication",
  },
  "coin-pl": {
    title: "코인 손익 계산기, 매수·매도가로 수익률·실현 수익",
    description: "매수가·매도가·수량을 넣으면 손익률(%)과 실현 수익 금액이 즉시. 수수료 반영 옵션으로 더 정확한 손익 확인.",
    ogTitle: "코인 손익 — 수익률·실현 수익",
    ogDescription: "매수·매도가·수량 입력만으로 손익률·실현 수익 자동.",
    name: "코인 손익 계산기",
    appCategory: "FinanceApplication",
  },
  "freelancer-tax": {
    title: "프리랜서 3.3% 원천징수 + 종합소득세 추정",
    description: "프리랜서·작가·강사의 연 수익으로 원천징수 3.3%와 다음해 5월 종합소득세 예상액을 즉시 산출. 5월 신고 전 대비용.",
    ogTitle: "3.3% 원천 + 종소세 추정",
    ogDescription: "프리랜서 연 수익으로 원천징수와 종합소득세 동시 추정.",
    name: "프리랜서 3.3% 원천징수",
    appCategory: "FinanceApplication",
  },
  "job-change": {
    title: "이직 손익 계산기, 연봉·복지·통근비 종합 비교",
    description: "현 직장과 새 직장의 연봉·복지(식대·보너스)·통근비·시간을 종합 비교. 단순 연봉 차이를 넘은 실질 이익을 한눈에.",
    ogTitle: "이직 손익 — 실질 이익 비교",
    ogDescription: "연봉·복지·통근비 합산 비교로 진짜 이득인지 한눈에 판단.",
    name: "이직 손익 계산기",
    appCategory: "FinanceApplication",
  },
  "inflation": {
    title: "인플레이션 환산, 과거 100만원의 현재·미래 가치",
    description: "특정 연도의 금액을 현재 화폐 가치로 환산하거나, 현재 자산의 미래 가치를 인플레이션 반영해 추정. 자산 계획에 필수.",
    ogTitle: "인플레이션 — 과거·미래 가치",
    ogDescription: "과거 금액의 현재가치·현재 자산의 미래가치 동시 환산.",
    name: "인플레이션 환산",
    appCategory: "FinanceApplication",
  },
  "remit-fee": {
    title: "해외 송금 수수료 비교, 은행·서비스별 실 부담액",
    description: "송금액·통화·은행/송금 서비스(와이즈·페이오니아 등)별 수수료와 환율 우대를 반영한 실 부담액을 한 표에서 비교.",
    ogTitle: "해외 송금 — 은행·서비스 비교",
    ogDescription: "수수료 + 환율 우대 반영 실 부담액을 서비스별 한 표 비교.",
    name: "외환 송금 수수료",
    appCategory: "FinanceApplication",
  },
  "rule-of-72": {
    title: "72의 법칙, 자산이 2배 되는 기간 즉시 계산",
    description: "현재 금리(연이율)만 넣으면 72의 법칙으로 자산이 2배로 불어나는 데 걸리는 햇수를 즉시 산출. 복리 투자의 직관적 계산.",
    ogTitle: "72의 법칙 — 자산 2배 기간",
    ogDescription: "연이율만 넣으면 자산이 2배 되는 햇수 즉시.",
    name: "72의 법칙 계산기",
    appCategory: "FinanceApplication",
  },
  "unemployment-benefit": {
    title: "실업급여 계산기, 1일 수급액·총 지급액 즉시",
    description: "평균임금과 고용보험 가입 기간을 넣으면 1일 수급액·총 지급액·수급 기간이 자동. 2026 고용보험법 기준 반영.",
    ogTitle: "실업급여 — 수급액·기간 자동",
    ogDescription: "평균임금·가입기간 입력으로 1일 수급액과 총 기간 즉시.",
    name: "실업급여 계산기",
    appCategory: "FinanceApplication",
  },

  // ───────── 부동산 ─────────
  "capital-gains": {
    title: "양도소득세 계산기, 1주택·다주택 공제까지 정확히",
    description: "취득가·양도가·보유 기간·1주택/다주택 여부로 양도세를 자동 산출. 장기보유특별공제·기본공제 반영, 매도 전 필수 점검.",
    ogTitle: "양도세 — 공제·중과까지 자동",
    ogDescription: "1주택·다주택, 보유 기간별 공제 자동 반영해 양도세 계산.",
    name: "양도소득세 계산기",
    appCategory: "FinanceApplication",
  },
  "acquisition-tax": {
    title: "취득세 계산기, 매매가·면적·주택수 즉시 반영",
    description: "매매가·전용면적·1주택/다주택 여부로 취득세율과 농어촌특별세·지방교육세까지 합산한 실 부담액 자동 산출.",
    ogTitle: "취득세 — 부속세까지 합산",
    ogDescription: "매매가·면적·주택수 반영해 취득세 + 부속세 실 부담액 자동.",
    name: "취득세 계산기",
    appCategory: "FinanceApplication",
  },
  "agent-fee": {
    title: "중개수수료 계산기, 매매·전세·월세 법정 한도 즉시",
    description: "매매·전세·월세 거래액별 법정 중개보수 한도를 자동 산출. 협의 한도와 실제 지불액 비교로 과다 수수료 방지에.",
    ogTitle: "중개수수료 — 법정 한도 즉시",
    ogDescription: "거래액·유형별 법정 중개보수 한도 자동, 과다 청구 방지.",
    name: "중개수수료 계산기",
    appCategory: "FinanceApplication",
  },
  "property-tax": {
    title: "재산세 계산기, 공시가격으로 재산세 + 도시지역분",
    description: "주택 공시가격을 넣으면 재산세 본세, 도시지역분, 지방교육세를 합한 연 재산세 총액이 즉시. 세 부담 미리 가늠하기.",
    ogTitle: "재산세 — 공시가격 한 줄로",
    ogDescription: "공시가격 입력만으로 재산세·도시분·지방교육세 합계 자동.",
    name: "재산세 계산기",
    appCategory: "FinanceApplication",
  },
  "jeonse-monthly": {
    title: "전월세 전환 계산기, 전세보증금 ↔ 월세 양방향",
    description: "전세보증금을 월세(보증금+월세)로, 또는 반대로 환산. 법정 전환율 기준으로 집주인 협상 전 실제 손익 가늠.",
    ogTitle: "전월세 전환 — 보증금↔월세",
    ogDescription: "전세 ↔ 월세 양방향 환산, 법정 전환율 반영해 협상에 활용.",
    name: "전월세 전환 계산기",
    appCategory: "FinanceApplication",
  },
  "rental-yield": {
    title: "임대수익률 계산기, 보증금·월세로 연 수익률 즉시",
    description: "매매가·보증금·월세를 넣으면 연 임대수익률(%)이 즉시. 매수 검토 시 다른 매물과의 수익률 비교가 직관적으로 가능.",
    ogTitle: "임대수익률 — 매물 비교 직관",
    ogDescription: "매매가·보증금·월세로 연 임대수익률 자동, 매물 비교용.",
    name: "임대수익률 계산기",
    appCategory: "FinanceApplication",
  },
  "cheongyak-score": {
    title: "청약 가점 계산기, 무주택·부양·통장 기간 자동 합산",
    description: "무주택 기간·부양가족·청약통장 가입 기간을 넣으면 총 84점 기준 청약 가점이 즉시. 청약 도전 전 객관적 점수 파악.",
    ogTitle: "청약 가점 — 총 84점 자동",
    ogDescription: "무주택·부양·통장 기간으로 청약 가점 84점 만점 자동 합산.",
    name: "청약 가점 계산기",
    appCategory: "FinanceApplication",
  },
  "ltv-dti": {
    title: "LTV·DTI·DSR 계산기, 대출 한도 한 화면에",
    description: "주택가·소득·기존 대출을 넣으면 LTV·DTI·DSR 세 가지 규제 비율과 가능한 최대 대출 한도를 한 번에 산출.",
    ogTitle: "LTV·DTI·DSR — 대출 한도",
    ogDescription: "주택가·소득·기존 대출로 세 규제 비율과 최대 한도 동시.",
    name: "LTV·DTI 계산기",
    appCategory: "FinanceApplication",
  },
  "jeonse-risk": {
    title: "전세 사기 위험도 체크, 깡통전세 5지표 즉시 진단",
    description: "보증금·매매가·근저당·전세가율·신탁등기 등 5가지 지표를 종합해 깡통전세 위험도를 즉시 진단. 계약 전 필수 점검.",
    ogTitle: "전세 사기 위험도 — 5지표 진단",
    ogDescription: "보증금·매매가·근저당으로 깡통전세 위험도 종합 진단.",
    name: "전세 사기 위험도 체크",
    appCategory: "FinanceApplication",
  },

  // ───────── 자동차 ─────────
  "car-tax": {
    title: "자동차세 계산기, 배기량·연식 경감까지 한 번에",
    description: "배기량·연식·승용/화물 구분으로 자동차세를 즉시. 3년 이상 차량 차령 경감과 지방교육세까지 합산해 실 납부액 표시.",
    ogTitle: "자동차세 — 차령 경감까지",
    ogDescription: "배기량·연식 반영한 자동차세 실 납부액 즉시.",
    name: "자동차세 계산기",
    appCategory: "UtilitiesApplication",
  },
  "fuel-cost": {
    title: "주유비 계산기, 거리·연비·기름값으로 한 번에",
    description: "주행거리·차량 연비·현재 기름값을 넣으면 총 주유비가 즉시. 장거리 여행 전 예산 짤 때, 차량 간 연비 비교 시 활용.",
    ogTitle: "주유비 — 거리·연비·기름값",
    ogDescription: "거리·연비·기름값으로 장거리 여행 주유비 즉시 산출.",
    name: "주유비 계산기",
    appCategory: "UtilitiesApplication",
  },
  "car-loan": {
    title: "자동차 할부 계산기, 월 할부금·총 이자 즉시",
    description: "차량가·계약금·할부 기간·금리를 넣으면 월 할부금과 총 이자가 한눈에. 대출 vs 일시불, 다른 차량과의 부담 비교에.",
    ogTitle: "자동차 할부 — 월 할부금",
    ogDescription: "차량가·계약금·기간·금리로 월 할부금·총 이자 즉시.",
    name: "자동차 할부 계산기",
    appCategory: "UtilitiesApplication",
  },
  "parking-fee": {
    title: "주차 요금 계산기, 기본·추가·할인까지 정확히",
    description: "기본 요금·추가 단위·할인 조건을 넣으면 총 주차비가 즉시. 백화점·병원·관공서·일반 유료주차장 모두 대응.",
    ogTitle: "주차 요금 — 기본·추가·할인",
    ogDescription: "주차 요금 기본·단위·할인 반영해 실 부담액 즉시.",
    name: "주차 요금 계산기",
    appCategory: "UtilitiesApplication",
  },
  "ev-charge": {
    title: "전기차 충전 비용 계산기, 주유비와 직접 비교",
    description: "주행거리·전비·요금제(완속·급속·홈)별 충전 비용과 동급 휘발유 차량의 주유비를 같은 화면에서 비교. 전기차 전환 검토용.",
    ogTitle: "전기차 충전 — 주유비와 비교",
    ogDescription: "거리·전비·요금제로 충전 비용 산출 + 주유비 직접 비교.",
    name: "전기차 충전 비용",
    appCategory: "UtilitiesApplication",
  },
  "toll-fee": {
    title: "고속도로 통행료 계산기, 출발·도착 IC 차종별",
    description: "출발·도착 IC와 차종(1~5종)을 넣으면 예상 통행료가 즉시. 서울→부산 같은 장거리 여행 전 예산 가늠에 유용.",
    ogTitle: "고속도로 통행료 — IC·차종별",
    ogDescription: "출발·도착 IC + 차종으로 통행료 즉시, 장거리 여행 예산용.",
    name: "고속도로 톨비 계산",
    appCategory: "UtilitiesApplication",
  },

  // ───────── 세금 ─────────
  "income-tax": {
    title: "종합소득세 계산기, 누진세율 적용 즉시 산출",
    description: "사업·근로·이자·배당 등 합산 종합소득을 넣으면 6~45% 누진세율 구간별 세액을 자동 산출. 5월 신고 전 예상 세액 점검.",
    ogTitle: "종합소득세 — 누진 자동 계산",
    ogDescription: "종합소득 입력으로 6~45% 누진세율 적용 세액 즉시.",
    name: "종합소득세 계산기",
    appCategory: "FinanceApplication",
  },
  "vat": {
    title: "부가가치세 계산기, 공급가↔부가세↔합계 양방향",
    description: "공급가액·부가세·합계금액 중 아무 값이나 넣으면 나머지가 즉시 채워집니다. 사업자 견적·세금계산서 작성 시 빠르게.",
    ogTitle: "부가세 — 10% 양방향 변환",
    ogDescription: "공급가↔부가세↔합계 어느 값이든 입력하면 나머지 자동.",
    name: "부가가치세 계산기",
    appCategory: "FinanceApplication",
  },
  "inheritance-tax": {
    title: "상속세 계산기, 상속재산·상속인 수 누진까지",
    description: "상속재산·상속인 수·관계별 공제를 반영해 상속세 누진세율(10~50%) 구간별 세액을 자동 산출. 상속 계획 사전 점검용.",
    ogTitle: "상속세 — 공제·누진 자동",
    ogDescription: "상속재산·상속인 수·관계별 공제 반영한 상속세 자동.",
    name: "상속세 계산기",
    appCategory: "FinanceApplication",
  },
  "gift-tax": {
    title: "증여세 계산기, 관계별 공제·누진 한 번에",
    description: "증여재산·증여자와의 관계별 공제(배우자·자녀·직계존속 등)를 자동 반영해 증여세 누진세액을 즉시 산출.",
    ogTitle: "증여세 — 관계별 공제 자동",
    ogDescription: "증여재산·관계별 공제 반영해 증여세 누진세액 즉시.",
    name: "증여세 계산기",
    appCategory: "FinanceApplication",
  },
  "severance": {
    title: "퇴직금 계산기, 평균임금·재직기간 즉시 산출",
    description: "입사일·퇴사일과 최근 3개월 평균임금을 넣으면 근로기준법 기준 퇴직금이 즉시. 퇴직 전 협의·확인용으로 필수.",
    ogTitle: "퇴직금 — 평균임금·재직 자동",
    ogDescription: "재직기간·평균임금으로 근로기준법 퇴직금 즉시.",
    name: "퇴직금 계산기",
    appCategory: "FinanceApplication",
  },
  "comprehensive-property-tax": {
    title: "종합부동산세 계산기, 1주택·다주택 누진 자동",
    description: "공시가격 합계와 1주택·다주택 여부를 넣으면 종부세 누진세율과 농어촌특별세까지 합한 실 부담액이 즉시.",
    ogTitle: "종부세 — 1주택·다주택 누진",
    ogDescription: "공시가격·주택 수로 종부세 + 농특세 합산액 자동.",
    name: "종합부동산세 계산기",
    appCategory: "FinanceApplication",
  },

  // ───────── 일상 ─────────
  "pyeong": {
    title: "평수 ↔ ㎡ 변환기, 평·헥타르·ft² 한 번에",
    description: "㎡·평·헥타르·ft² 어느 단위든 한 칸에 넣으면 나머지 모두 즉시 변환. 부동산 매물·전세 평수 환산에 자주 쓰임.",
    ogTitle: "평수 변환 — 4단위 동시",
    ogDescription: "㎡·평·헥타르·ft² 어느 값이든 입력하면 모두 동시 변환.",
    name: "평수·㎡ 변환기",
    appCategory: "UtilitiesApplication",
  },
  "age": {
    title: "만 나이 계산기, 다음 생일 D-Day까지 한 번에",
    description: "생년월일만 넣으면 만 나이·연 나이·다음 생일까지 며칠 남았는지 즉시 표시. 2023년 만 나이 통일법 기준 반영.",
    ogTitle: "만 나이 — 생일 D-Day까지",
    ogDescription: "생년월일로 만 나이·연 나이·다음 생일 D-Day 한 번에.",
    name: "만 나이 계산기",
    appCategory: "UtilitiesApplication",
  },
  "dday": {
    title: "D-Day 계산기, 두 날짜 차이·N일 후 정확히",
    description: "두 날짜의 차이(일·주·달·년)와 특정 날짜에서 N일 후·전이 어떤 날인지 즉시. 시험·결혼·여행 D-Day 카운팅에.",
    ogTitle: "D-Day — 두 날짜 차이",
    ogDescription: "두 날짜 차이 + N일 후·전 날짜 양방향 즉시 계산.",
    name: "D-Day 계산기",
    appCategory: "UtilitiesApplication",
  },
  "percent": {
    title: "백분율 계산기, %·증감률·전체에서 비율 한 번에",
    description: "A는 B의 몇 %? B의 X%는 얼마? 증감률은? 세 가지 계산을 한 페이지에서 즉시. 통계·할인·성적 등 모든 % 계산.",
    ogTitle: "백분율 — % 모든 계산",
    ogDescription: "비율·증감률·전체에서 %까지 3가지 계산 한 페이지.",
    name: "백분율 계산기",
    appCategory: "UtilitiesApplication",
  },
  "discount": {
    title: "할인율 계산기, 정가·할인가·할인율 양방향",
    description: "정가·할인율·할인가 중 두 값만 넣으면 나머지가 즉시. 쇼핑·세일·가격 비교에서 진짜 할인이 얼마인지 빠르게.",
    ogTitle: "할인율 — 정가·할인가 양방향",
    ogDescription: "정가·할인가·할인율 중 두 값만 넣어도 나머지 자동.",
    name: "할인율 계산기",
    appCategory: "UtilitiesApplication",
  },
  "tip": {
    title: "팁·N빵 계산기, 봉사료 + 인원 분담 즉시",
    description: "총액·봉사료(%)·인원을 넣으면 1인당 분담액이 즉시. 회식·해외 식사·여행 정산에서 머리 안 굴려도 끝.",
    ogTitle: "팁·N빵 — 1인당 분담 즉시",
    ogDescription: "총액·봉사료·인원으로 1인당 분담액 즉시, 회식 정산용.",
    name: "팁·N빵 계산기",
    appCategory: "UtilitiesApplication",
  },
  "gpa": {
    title: "GPA 학점 계산기, 4.5·4.3·100점 동시 환산",
    description: "과목명·학점·등급(A+~F)을 입력하면 누적 평점이 4.5·4.3·100점 척도로 동시에. 교환학생·인턴 지원서에 필수.",
    ogTitle: "GPA — 4.5·4.3·100점 환산",
    ogDescription: "과목·학점·등급으로 4.5·4.3·100점 척도 동시 환산.",
    name: "학점 (GPA) 계산기",
    appCategory: "UtilitiesApplication",
  },
  "electricity": {
    title: "전기요금 계산기, 누진제 반영해 월 청구액 정확히",
    description: "월 사용량(kWh)만 넣으면 주택용 누진제 3단계가 반영된 월 전기요금이 즉시. 여름철 에어컨 가동 시 요금 시뮬레이션에.",
    ogTitle: "전기요금 — 누진제 자동",
    ogDescription: "월 사용량 입력으로 주택용 누진 3단계 반영 요금 즉시.",
    name: "전기요금 계산기",
    appCategory: "UtilitiesApplication",
  },
  "lunar": {
    title: "음력 ↔ 양력 변환, 띠·간지까지 한 번에",
    description: "양력 → 음력, 음력 → 양력 양방향 변환 + 그 해의 띠와 간지(육십갑자)까지 동시 표시. 생일·제사·길일 확인용.",
    ogTitle: "음력 양력 — 띠·간지 동시",
    ogDescription: "양력↔음력 양방향 + 띠·간지(육십갑자) 한 번에 표시.",
    name: "음력 ↔ 양력 변환",
    appCategory: "UtilitiesApplication",
  },
  "zodiac": {
    title: "띠·별자리·혈액형 궁합, 생년월일로 한 번에",
    description: "생년월일을 넣으면 띠(12지신), 별자리(12궁), 그리고 혈액형까지 한 번에 확인. 친구·연인 궁합 빠른 진단에.",
    ogTitle: "띠·별자리 — 생일로 한 번에",
    ogDescription: "생년월일로 띠·12별자리·혈액형 궁합까지 즉시.",
    name: "띠·별자리 계산기",
    appCategory: "UtilitiesApplication",
  },
  "unit": {
    title: "단위 변환기, 길이·무게·온도·부피·속도 한 페이지",
    description: "길이·무게·온도·부피·속도·면적까지 모든 단위 변환이 한 페이지에서. 어느 단위에 넣어도 나머지 단위가 즉시 변환.",
    ogTitle: "단위 변환 — 6분류 한 페이지",
    ogDescription: "길이·무게·온도·부피·속도·면적 모두 한 페이지에 양방향.",
    name: "단위 변환기",
    appCategory: "UtilitiesApplication",
  },
  "timezone": {
    title: "세계 시간 변환기, 한국↔뉴욕·런던·도쿄 즉시",
    description: "한국 기준 시각을 넣으면 뉴욕·런던·도쿄·LA 등 주요 도시의 현지 시각이 즉시. 화상회의·해외 출장 일정 잡을 때.",
    ogTitle: "세계 시간 — 주요 도시 동시",
    ogDescription: "한국 시각 기준 뉴욕·런던·도쿄 주요 도시 시차 한 번에.",
    name: "세계 시간 변환기",
    appCategory: "UtilitiesApplication",
  },
  "lotto": {
    title: "로또 번호 생성기, 통계 패턴 반영 자동 추천",
    description: "로또 6/45 번호와 보너스를 자동 생성. 단순 랜덤이 아닌 자주 나오는 번호·범위 통계까지 함께 표시.",
    ogTitle: "로또 번호 — 통계 패턴 반영",
    ogDescription: "로또 6/45 번호 자동 생성 + 자주 나오는 번호 통계 표시.",
    name: "로또 번호 생성기",
    appCategory: "UtilitiesApplication",
  },
  "pomodoro": {
    title: "포모도로 타이머, 25분 집중·5분 휴식 자동 사이클",
    description: "25분 작업과 5분 휴식을 자동 반복하는 포모도로 기법 타이머. 화면을 닫지 않으면 알림으로 다음 단계를 알려줍니다.",
    ogTitle: "포모도로 — 25/5 자동 반복",
    ogDescription: "25분 집중·5분 휴식 자동 반복, 알림으로 다음 사이클.",
    name: "포모도로 타이머",
    appCategory: "UtilitiesApplication",
  },
  "countdown": {
    title: "카운트다운 타이머, 원하는 시간 알람까지",
    description: "원하는 시간을 설정하면 0초까지 카운트다운하고 알림. 요리·운동·시험·발표 등 시간 제한 작업에 유용.",
    ogTitle: "카운트다운 — 시간 설정 알림",
    ogDescription: "원하는 시간 설정 후 0초 카운트다운 + 알림.",
    name: "카운트다운 타이머",
    appCategory: "UtilitiesApplication",
  },
  "unit-price": {
    title: "g당 단가 비교, 용량 다른 상품도 한눈에",
    description: "여러 상품의 가격과 용량을 넣으면 g당·100g당·ml당 단가가 자동. 대용량이 진짜 싼지, 묶음이 이득인지 명확히.",
    ogTitle: "g당 단가 — 묶음 vs 단품",
    ogDescription: "가격·용량 입력으로 g당·100g당·ml당 단가 자동 비교.",
    name: "단가 비교 (g당)",
    appCategory: "UtilitiesApplication",
  },
  "annual-leave": {
    title: "연차·휴가 계산기, 입사일·출근율 자동 반영",
    description: "입사일과 출근율을 넣으면 근로기준법 기준 연차(1년 미만 월차·1년차 26일·가산일수 포함)가 즉시. 인사 담당자·직장인 필수.",
    ogTitle: "연차 — 근로기준법 자동",
    ogDescription: "입사일·출근율로 1년 미만 월차·가산일수까지 연차 자동.",
    name: "연차·휴가 일수 계산기",
    appCategory: "UtilitiesApplication",
  },

  // ───────── 개발자 ─────────
  "password": {
    title: "안전한 비밀번호 생성기, 길이·문자 종류 선택",
    description: "길이와 대·소문자·숫자·특수문자 포함 여부를 선택해 안전한 비밀번호를 즉시 생성. 모든 처리는 브라우저 안에서.",
    ogTitle: "비밀번호 — 안전한 즉시 생성",
    ogDescription: "길이·문자 종류 선택해 안전한 비밀번호 즉시 생성.",
    name: "비밀번호 생성기",
    appCategory: "DeveloperApplication",
  },
  "color": {
    title: "색상 변환기, HEX·RGB·HSL 동시 + 미리보기",
    description: "HEX·RGB·HSL 어느 값이든 입력하면 나머지가 즉시 변환되고 실제 색상이 미리보기로. 디자이너·개발자 일상 도구.",
    ogTitle: "색상 변환 — HEX·RGB·HSL",
    ogDescription: "HEX·RGB·HSL 동시 변환 + 색상 미리보기 한 페이지.",
    name: "색상 변환기",
    appCategory: "DeveloperApplication",
  },
  "uuid": {
    title: "UUID 생성기, v4 1~100개 일괄 즉시",
    description: "표준 UUID v4를 한 번에 1~100개까지 일괄 생성. 복사 버튼 한 번으로 모두 클립보드, 임시 키·테스트 데이터에.",
    ogTitle: "UUID v4 — 1~100개 일괄",
    ogDescription: "UUID v4 표준 형식으로 한 번에 100개까지 일괄 생성.",
    name: "UUID 생성기",
    appCategory: "DeveloperApplication",
  },
  "json-format": {
    title: "JSON 포매터, 정렬·압축·문법 검증 한 번에",
    description: "JSON 문자열을 들여쓰기 정렬, 한 줄 압축, 문법 오류 검증까지 한 페이지에서. 오류 위치를 줄·열로 정확히 표시.",
    ogTitle: "JSON 포매터 — 정렬·압축·검증",
    ogDescription: "JSON 정렬·압축·문법 검증, 오류 위치를 줄·열로 표시.",
    name: "JSON 포매터",
    appCategory: "DeveloperApplication",
  },
  "base64": {
    title: "Base64 인코딩·디코딩, 한글 깨짐 없이 양방향",
    description: "문자열과 Base64를 양쪽에서 실시간 변환. UTF-8 한글·이모지 깨짐 없음, 입력값은 브라우저 밖으로 나가지 않습니다.",
    ogTitle: "Base64 — 한글 OK 양방향",
    ogDescription: "문자열↔Base64 실시간, 한글·이모지 깨짐 없이 변환.",
    name: "Base64 인코딩·디코딩",
    appCategory: "DeveloperApplication",
  },
  "url-encode": {
    title: "URL 인코딩·디코딩, 한글·특수문자 양방향 즉시",
    description: "URL의 한글·공백·특수문자를 percent-encoding으로 변환하거나 디코딩. 쿼리스트링·API 요청 디버깅에 자주 사용.",
    ogTitle: "URL 인코딩 — 한글·특수문자",
    ogDescription: "URL 한글·특수문자 percent-encoding 양방향 즉시.",
    name: "URL 인코딩·디코딩",
    appCategory: "DeveloperApplication",
  },
  "jwt-decode": {
    title: "JWT 디코더, header·payload·signature 즉시 분석",
    description: "JWT 토큰을 붙여 넣으면 header·payload·signature 세 영역과 만료 시간(exp)까지 즉시 분석. 토큰은 서버로 전송되지 않습니다.",
    ogTitle: "JWT 디코더 — 토큰 즉시 분석",
    ogDescription: "JWT의 header·payload·만료까지 즉시 분석, 토큰 외부 X.",
    name: "JWT 디코더",
    appCategory: "DeveloperApplication",
  },
  "regex-test": {
    title: "정규식 테스터, 매칭·그룹·플래그 실시간 확인",
    description: "정규식 패턴과 테스트 문자열을 넣으면 매칭 결과·캡처 그룹·플래그(g·i·m)까지 실시간 표시. 정규식 학습·디버깅에.",
    ogTitle: "정규식 테스터 — 실시간 매칭",
    ogDescription: "패턴·문자열로 매칭 결과·캡처 그룹·플래그 실시간.",
    name: "정규식 테스터",
    appCategory: "DeveloperApplication",
  },
  "ai-token": {
    title: "AI 토큰 비용 계산기, GPT·Claude·Gemini 한 표 비교",
    description: "입력·출력 토큰 수와 모델을 선택하면 OpenAI·Claude·Gemini API 비용이 한 표에서 비교. 가장 저렴한 모델을 한눈에.",
    ogTitle: "AI 토큰 비용 — 3사 비교",
    ogDescription: "GPT·Claude·Gemini의 토큰 비용을 한 표에서 즉시 비교.",
    name: "AI 토큰 비용 계산기",
    appCategory: "DeveloperApplication",
  },
  "qr-code": {
    title: "QR 코드 생성기, URL·텍스트·Wi-Fi 즉시 다운로드",
    description: "URL·텍스트·Wi-Fi 정보 등을 입력하면 QR 코드가 즉시 생성, PNG·SVG로 바로 다운로드. 명함·포스터·매장 안내에.",
    ogTitle: "QR 코드 — PNG·SVG 다운",
    ogDescription: "URL·텍스트로 QR 즉시 생성, PNG·SVG 다운로드.",
    name: "QR 코드 생성기",
    appCategory: "DeveloperApplication",
  },
  "color-palette": {
    title: "컬러 팔레트 생성기, 보색·유사·삼각·사각 자동 5색",
    description: "기준 색 하나만 넣으면 보색·유사·삼각·사각 4가지 조화 규칙으로 5색 팔레트 자동 생성. 디자인 시안 시작점에.",
    ogTitle: "컬러 팔레트 — 4규칙 자동",
    ogDescription: "기준 색 하나로 보색·유사·삼각·사각 5색 팔레트 자동.",
    name: "컬러 팔레트 생성기",
    appCategory: "DeveloperApplication",
  },
  "markdown": {
    title: "마크다운 미리보기·HTML·PDF 변환, GFM 실시간",
    description: "Markdown을 실시간 HTML 미리보기로 확인하고 HTML·PDF로 바로 다운로드. GFM 표·체크박스·코드 하이라이팅 지원.",
    ogTitle: "마크다운 — HTML·PDF 변환",
    ogDescription: "MD 실시간 미리보기 + HTML·PDF 다운로드, GFM 지원.",
    name: "마크다운 미리보기·변환",
    appCategory: "DeveloperApplication",
  },
  "timestamp": {
    title: "Unix 타임스탬프 변환, KST·UTC·ISO 9가지 동시",
    description: "Unix timestamp를 KST·UTC·ISO·RFC·밀리초·나노초 등 9가지 포맷으로 동시 변환. 어떤 단위든 입력 즉시 양방향.",
    ogTitle: "타임스탬프 — 9포맷 동시",
    ogDescription: "Unix↔날짜 9가지 포맷(KST·UTC·ISO·ms·ns) 동시 변환.",
    name: "Unix 타임스탬프 변환",
    appCategory: "DeveloperApplication",
  },
  "cron": {
    title: "Cron 표현식 해석기, 한국어 + 다음 5회 실행 시간",
    description: "Cron 표현식(0 9 * * 1)을 한국어로 풀어 설명 + 다음 5회 실행 시간을 미리보기. 5필드 표준(분·시·일·월·요일) 지원.",
    ogTitle: "Cron 해석 — 한국어 + 미리보기",
    ogDescription: "Cron 식을 한국어로 풀고 다음 5회 실행 시간 미리보기.",
    name: "Cron 표현식 해석기",
    appCategory: "DeveloperApplication",
  },
  "sql-format": {
    title: "SQL 포매터, 8가지 dialect 자동 들여쓰기",
    description: "압축된 SQL 쿼리를 들여쓰기·키워드 대문자로 정돈. MySQL·PostgreSQL·SQLite·BigQuery 등 8가지 dialect 지원.",
    ogTitle: "SQL 포매터 — 8 dialect",
    ogDescription: "압축 SQL 자동 들여쓰기·대문자, 8가지 dialect 지원.",
    name: "SQL 포매터",
    appCategory: "DeveloperApplication",
  },
  "csv-json": {
    title: "CSV ↔ JSON 변환, 헤더·구분자 자동 인식 양방향",
    description: "CSV ↔ JSON을 양방향 변환. 헤더 자동 인식·구분자 감지·숫자 타입 자동, 미리보기 테이블로 결과를 즉시 확인.",
    ogTitle: "CSV ↔ JSON — 양방향 자동",
    ogDescription: "CSV↔JSON 양방향, 헤더·구분자 자동 인식 + 미리보기.",
    name: "CSV ↔ JSON 변환기",
    appCategory: "DeveloperApplication",
  },
  "hash": {
    title: "해시 생성기, MD5·SHA·HMAC 텍스트·파일 동시",
    description: "텍스트나 파일을 넣으면 MD5·SHA-1·SHA-256·SHA-384·SHA-512가 동시에. HMAC 서명까지, 파일 무결성·체크섬에.",
    ogTitle: "해시 — MD5·SHA·HMAC",
    ogDescription: "텍스트·파일을 MD5·SHA·HMAC 동시 생성, 무결성 검증용.",
    name: "해시 생성기 (MD5·SHA·HMAC)",
    appCategory: "DeveloperApplication",
  },

  // ───────── 라이프 ─────────
  "wedding-cost": {
    title: "결혼 비용 계산기, 예식·예물·신혼여행 한국 평균",
    description: "예식·예물·신혼여행·집 셋업 항목별 한국 평균 비용을 합산. 신랑·신부 분담까지 시뮬레이션, 결혼 자금 계획의 출발점.",
    ogTitle: "결혼 비용 — 항목별 한국 평균",
    ogDescription: "예식·예물·신혼여행·집 셋업 한국 평균을 항목별 합산.",
    name: "결혼 비용 계산기",
    appCategory: "LifestyleApplication",
  },
  "child-cost": {
    title: "자녀 양육비 계산기, 0~18세 누적 + 사교육 시뮬",
    description: "자녀 출생부터 18세까지의 누적 양육비를 단계별로 추정 + 사교육비 시나리오까지. 가족 자산 계획·출산 검토에.",
    ogTitle: "양육비 — 0~18세 누적 추정",
    ogDescription: "0~18세 양육비 단계별 + 사교육비 시나리오 시뮬레이션.",
    name: "자녀 양육비 계산",
    appCategory: "LifestyleApplication",
  },
  "compatibility": {
    title: "궁합 계산기, 두 사람 생년월일로 동·서양 동시",
    description: "두 사람의 생년월일을 넣으면 동양 띠·서양 별자리 기준 궁합을 동시 분석. 연인·친구·결혼 상대 빠른 진단에.",
    ogTitle: "궁합 — 동·서양 동시 분석",
    ogDescription: "생년월일 두 개로 띠·별자리 기준 궁합 동시 진단.",
    name: "궁합 계산기",
    appCategory: "LifestyleApplication",
  },
  "mbti-compatibility": {
    title: "MBTI 궁합, 16×16 매트릭스 + 관계 팁",
    description: "두 사람의 MBTI를 선택하면 16×16 궁합표 기반 관계 분석과 잘 지내기 위한 구체적 팁이 즉시. 연애·동료 관계용.",
    ogTitle: "MBTI 궁합 — 16×16 + 관계 팁",
    ogDescription: "MBTI 두 개로 16×16 궁합 매트릭스 + 관계 팁.",
    name: "MBTI 궁합",
    appCategory: "LifestyleApplication",
  },
  "carbon-footprint": {
    title: "탄소 발자국 계산기, 운전·여행·식단·전기로 CO₂",
    description: "운전 거리·항공 여행·식단·전기 사용을 넣으면 일·연 CO₂ 배출량이 즉시. 한국 가구 평균과 비교로 직관적 진단.",
    ogTitle: "탄소 발자국 — 항목별 CO₂",
    ogDescription: "운전·여행·식단·전기로 연 CO₂ 배출량 + 평균 비교.",
    name: "탄소 발자국 계산기",
    appCategory: "LifestyleApplication",
  },
  "korea-rank": {
    title: "한국에서 몇 번째? 같은 생일·이름·키 순위 진단",
    description: "생년월일·이름·키만 넣으면 같은 생일 동기·이름·키 분위·성씨 순위·누적 출생 순번 등 6가지를 한 페이지에서 진단.",
    ogTitle: "한국 순위 — 6가지 진단",
    ogDescription: "같은 생일·이름·키 분위·성씨 순위 등 6지표 한 페이지.",
    name: "한국에서 몇 번째? 진단",
    appCategory: "LifestyleApplication",
  },

  // ───────── 문서 ─────────
  "pdf-merge": {
    title: "PDF 합치기, 설치 없이 10초 만에 끝내는 무료",
    description: "여러 PDF 파일을 드래그 한 번으로 결합. 파일이 서버로 전송되지 않아 안전합니다. 가입·설치·워터마크 없이 즉시 다운로드.",
    ogTitle: "PDF 합치기 — 설치 없이 10초",
    ogDescription: "여러 PDF를 드래그로 결합, 가입·워터마크 없이 즉시 다운로드.",
    name: "PDF 합치기",
    appCategory: "BusinessApplication",
  },
  "pdf-split": {
    title: "PDF 분할, 페이지 단위로 자르기 무료 즉시",
    description: "PDF 한 파일을 페이지 단위·범위 지정으로 무료 분할. 파일은 브라우저 안에서만 처리, 가입·설치·워터마크 없음.",
    ogTitle: "PDF 분할 — 페이지·범위 지정",
    ogDescription: "PDF를 페이지 단위·범위 지정으로 무료 분할, 외부 전송 X.",
    name: "PDF 분할",
    appCategory: "BusinessApplication",
  },
  "pdf-compress": {
    title: "PDF 용량 줄이기, 이메일 첨부 한도 회피 무료",
    description: "PDF 파일 용량을 무료로 압축. 이메일 첨부·업로드 한도(10MB·25MB) 회피에 가장 자주 쓰이는 도구. 브라우저 내 처리.",
    ogTitle: "PDF 압축 — 이메일 첨부 OK",
    ogDescription: "PDF 용량 무료 압축, 이메일·업로드 한도 회피용.",
    name: "PDF 용량 줄이기",
    appCategory: "BusinessApplication",
  },
  "pdf-extract": {
    title: "PDF 페이지 추출, 원하는 페이지만 새 파일로",
    description: "PDF 전체에서 필요한 페이지만 골라 새 파일로 무료 추출. 페이지 범위 지정 가능, 브라우저 내 처리로 안전.",
    ogTitle: "PDF 추출 — 원하는 페이지만",
    ogDescription: "PDF에서 필요한 페이지만 골라 새 파일로 무료 추출.",
    name: "PDF 페이지 추출",
    appCategory: "BusinessApplication",
  },
  "pdf-rotate": {
    title: "PDF 회전, 90·180·270도 무료 한 번에",
    description: "PDF 페이지를 90·180·270도 회전해 가로·세로 정렬을 맞춤. 페이지별 다른 각도 가능, 가입·설치·워터마크 없음.",
    ogTitle: "PDF 회전 — 90·180·270도",
    ogDescription: "PDF 페이지 90·180·270도 무료 회전, 페이지별 각도 가능.",
    name: "PDF 회전",
    appCategory: "BusinessApplication",
  },
  "pdf-to-image": {
    title: "PDF → JPG·PNG 이미지, 화질 선택 무료 변환",
    description: "PDF의 각 페이지를 JPG·PNG 이미지로 무료 변환. 화질·DPI 선택 가능, 브라우저 안에서만 처리되어 외부 전송 0.",
    ogTitle: "PDF → 이미지 — 화질 선택",
    ogDescription: "PDF 페이지를 JPG·PNG로 무료 변환, 화질·DPI 선택.",
    name: "PDF → 이미지",
    appCategory: "BusinessApplication",
  },
  "image-to-pdf": {
    title: "JPG·PNG → PDF 변환, 여러 장 한 번에 무료",
    description: "JPG·PNG 여러 장을 하나의 PDF로 무료 변환. 드래그로 순서 조정, 페이지 크기·방향 선택 가능. 가입·설치 없음.",
    ogTitle: "이미지 → PDF — 여러 장 한 번에",
    ogDescription: "JPG·PNG 여러 장을 한 PDF로 무료, 순서·크기 조정.",
    name: "이미지 → PDF",
    appCategory: "BusinessApplication",
  },
  "pdf-watermark": {
    title: "PDF 워터마크, 텍스트·위치·투명도 무료 추가",
    description: "PDF 전체 페이지에 텍스트 워터마크를 무료로 추가. 위치(대각선·중앙·모서리)와 투명도·색상·크기 자유롭게 설정.",
    ogTitle: "PDF 워터마크 — 자유 설정",
    ogDescription: "PDF에 텍스트 워터마크 자유 위치·투명도로 무료 추가.",
    name: "PDF 워터마크",
    appCategory: "BusinessApplication",
  },
  "word-count": {
    title: "글자수 세기, 자소서·SNS 한도 실시간 표시",
    description: "공백 포함·제외·바이트·원고지 매수·자소서·SNS 한도(트위터·인스타)까지 실시간 카운트. 자소서·논문·블로그 글에 필수.",
    ogTitle: "글자수 — 자소서·SNS 한도",
    ogDescription: "공백·바이트·원고지·SNS 한도 실시간 카운트, 자소서 필수.",
    name: "글자수 세기",
    appCategory: "BusinessApplication",
  },
  "strip-metadata": {
    title: "PDF·이미지 메타데이터 제거, GPS·작성자 완전 삭제",
    description: "PDF·JPG·PNG·WebP의 작성자·GPS·카메라·수정 이력을 완전 제거. 처리 전후 비교와 재검증, 익명화 공유 전 필수.",
    ogTitle: "메타 제거 — GPS·작성자 완전",
    ogDescription: "PDF·이미지의 GPS·작성자·EXIF 완전 제거, 익명화용.",
    name: "메타데이터 제거",
    appCategory: "BusinessApplication",
  },
  "pdf-sign": {
    title: "PDF 손글씨 서명, 마우스·터치로 무료 사인",
    description: "PDF에 손글씨 서명을 마우스·터치·펜으로 직접 그려 추가. 드래그·리사이즈로 정확한 위치 배치, 가입·설치 없이 무료.",
    ogTitle: "PDF 서명 — 손글씨로 무료",
    ogDescription: "PDF에 손글씨 서명 마우스·터치로 그려 무료 추가.",
    name: "PDF 손글씨 서명",
    appCategory: "BusinessApplication",
  },
  "pdf-password": {
    title: "PDF 비밀번호 잠금·해제, AES-256 무료",
    description: "PDF를 AES-256/128 표준으로 암호화 잠금하거나 비밀번호를 알고 있는 PDF의 잠금을 해제. qpdf 엔진 기반, 무료.",
    ogTitle: "PDF 잠금·해제 — AES-256",
    ogDescription: "PDF AES-256 잠금/비번 알고 있는 PDF 해제 무료.",
    name: "PDF 비밀번호 잠금·해제",
    appCategory: "BusinessApplication",
  },
  "pdf-batch": {
    title: "PDF 일괄 처리, 100장+ 페이지번호·워터마크·잠금 한 번에",
    description: "여러 PDF에 페이지 번호·워터마크·메타 제거·비밀번호 잠금을 한 번에. 100장 이상 가능, zip 일괄 다운로드. 브라우저 처리.",
    ogTitle: "PDF 일괄 — 100장+ 한 번에",
    ogDescription: "여러 PDF 페이지 번호·워터마크·잠금 한 번에, zip 다운로드.",
    name: "PDF 일괄 처리",
    appCategory: "BusinessApplication",
  },

  // ───────── 이미지 ─────────
  "id-photo": {
    title: "증명사진 만들기, 여권·이력서·민증 9종 규격 자동",
    description: "여권·이력서·민증·비자 등 한국 9종 규격으로 사진을 자동 크롭. 배경색 변경, 300 DPI 인쇄 품질, 브라우저 안에서.",
    ogTitle: "증명사진 — 한국 9종 규격",
    ogDescription: "여권·이력서·민증·비자 9종 자동 크롭 + 배경색 + 300DPI.",
    name: "증명사진 만들기",
    appCategory: "MultimediaApplication",
  },
  "image-compress": {
    title: "이미지 압축, JPG·PNG·WebP 일괄 + 품질 조정",
    description: "JPG·PNG·WebP 이미지를 한 번에 일괄 압축. 품질 조정·원본 비교로 화질 손상 없이 용량만 줄임. 외부 전송 없음.",
    ogTitle: "이미지 압축 — 일괄·품질 조정",
    ogDescription: "JPG·PNG·WebP 일괄 압축, 품질·원본 비교로 화질 유지.",
    name: "이미지 압축",
    appCategory: "MultimediaApplication",
  },
  "image-resize": {
    title: "이미지 크기 변경, 인스타·유튜브·블로그 프리셋까지",
    description: "사진 픽셀·비율을 무료로 변경. 인스타 1080·유튜브 썸네일·OG 1200x630·이력서 사진 등 프리셋 + 비율 유지·고화질 리샘플링. 사진은 서버로 전송되지 않습니다.",
    ogTitle: "이미지 리사이즈 — SNS 프리셋 + 고화질",
    ogDescription: "사진 픽셀·비율 무료 변경, 인스타·유튜브·OG 프리셋, 브라우저 안에서 처리.",
    name: "이미지 크기 변경 (리사이즈)",
    appCategory: "MultimediaApplication",
  },
  "remove-background": {
    title: "사진 누끼 따기, AI 자동 배경 제거 무료",
    description: "브라우저에서 AI로 즉시 누끼 따기. 인물·상품·반려동물 자동 인식, 투명 PNG·증명사진 배경색 변경. 사진 외부 전송 0.",
    ogTitle: "누끼 따기 — AI 자동, 외부 X",
    ogDescription: "AI 자동 인식으로 누끼 따기, 투명 PNG·배경색, 외부 전송 0.",
    name: "사진 누끼 따기 (배경 제거)",
    appCategory: "MultimediaApplication",
  },
};

// ─── 생성기 ───
function jsTpl(slug, e) {
  const url = `https://calai.kr/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: e.name,
    description: e.description,
    url,
    applicationCategory: e.appCategory,
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
    isAccessibleForFree: true,
  };

  return `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ${JSON.stringify(e.title)},
  description: ${JSON.stringify(e.description)},
  openGraph: {
    title: ${JSON.stringify(e.ogTitle)},
    description: ${JSON.stringify(e.ogDescription)},
    url: ${JSON.stringify(url)},
    siteName: "calai",
    locale: "ko_KR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: ${JSON.stringify(e.ogTitle)},
    description: ${JSON.stringify(e.ogDescription)},
  },
  alternates: { canonical: ${JSON.stringify(url)} },
};

const jsonLd = ${JSON.stringify(jsonLd, null, 2)};

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
`;
}

const slugs = Object.keys(SEO);
let ok = 0;
const missing = [];

for (const slug of slugs) {
  const dir = join(APP_DIR, slug);
  if (!existsSync(dir)) {
    missing.push(slug);
    continue;
  }
  const file = join(dir, "layout.tsx");
  writeFileSync(file, jsTpl(slug, SEO[slug]), "utf-8");
  ok++;
}

console.log(`✓ ${ok} layout.tsx 갱신`);
if (missing.length) {
  console.log(`⚠ 디렉터리 없음: ${missing.join(", ")}`);
}
console.log(`총 ${slugs.length}개 SEO 엔트리`);
