import type { Tool } from "@/lib/tools";

type Step = { title: string; desc: string };

const STEPS_BY_CATEGORY: Record<Tool["category"], Step[]> = {
  건강: [
    { title: "정보 입력", desc: "키·체중·나이 등 필요한 값을 한 번에" },
    { title: "즉시 계산", desc: "공식 기준으로 자동 산출, 대기 없음" },
    { title: "결과 활용", desc: "비교 기준·권장 범위까지 한눈에" },
  ],
  금융: [
    { title: "금액·기간 입력", desc: "원금·이율·기간 등 핵심만" },
    { title: "즉시 계산", desc: "원리금·이자·실수령액 자동 산출" },
    { title: "결과 비교", desc: "방식·시나리오별 한 화면에서 비교" },
  ],
  부동산: [
    { title: "거래 정보 입력", desc: "매매가·면적·보유 기간 등" },
    { title: "세금·수익률 자동", desc: "최신 법령 기준 누진·공제 반영" },
    { title: "의사결정", desc: "매수·매도 전 부담액·수익률 확인" },
  ],
  자동차: [
    { title: "차량 정보 입력", desc: "배기량·연식·주행거리 등" },
    { title: "자동 산출", desc: "세금·요금·할부금이 즉시" },
    { title: "예산 비교", desc: "차량 간·시나리오 간 한눈에" },
  ],
  세금: [
    { title: "과세 정보 입력", desc: "소득·재산·관계 등 필수만" },
    { title: "누진·공제 반영", desc: "최신 세법 기준 자동 계산" },
    { title: "신고 전 점검", desc: "예상 세액·실 부담액 확인" },
  ],
  일상: [
    { title: "값 입력", desc: "필요한 정보만 간단히" },
    { title: "즉시 환산", desc: "단위·비율·날짜가 자동으로" },
    { title: "복사·활용", desc: "결과를 그대로 어디든" },
  ],
  개발자: [
    { title: "입력 붙여넣기", desc: "JSON·SQL·URL 등 그대로 입력" },
    { title: "실시간 처리", desc: "포맷·변환·검증이 즉시" },
    { title: "복사·다운로드", desc: "결과를 클립보드/파일로" },
  ],
  여행: [
    { title: "여행 정보 입력", desc: "출발·도착·인원 등" },
    { title: "비용·시간 자동", desc: "환율·요금·이동시간 반영" },
    { title: "여정 확정", desc: "예산 안에서 최적안 확인" },
  ],
  라이프: [
    { title: "조건 입력", desc: "생년월일·인원·항목 등" },
    { title: "즉시 분석", desc: "한국 평균·시나리오 자동 반영" },
    { title: "결과 활용", desc: "비교·계획·공유에 바로" },
  ],
  문서: [
    { title: "파일 업로드", desc: "드래그 또는 클릭, 여러 장 OK" },
    { title: "옵션 설정", desc: "필요한 설정만 가볍게 선택" },
    { title: "다운로드", desc: "처리 후 바로 저장, 외부 전송 0" },
  ],
  이미지: [
    { title: "사진 업로드", desc: "JPG·PNG·WebP 어디서든" },
    { title: "즉시 처리", desc: "AI·필터가 브라우저 안에서" },
    { title: "결과 저장", desc: "원본 손상 없이 새 파일로" },
  ],
};

type Props = {
  category: Tool["category"];
};

export default function HowToSteps({ category }: Props) {
  const steps = STEPS_BY_CATEGORY[category];
  if (!steps) return null;

  return (
    <section className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-6 sm:p-8">
      <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-indigo-600 dark:text-indigo-400 mb-5"
           style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
        이렇게 사용해요
      </div>
      <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {steps.map((step, i) => (
          <li key={i} className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold mb-3 tabular-nums">
              {i + 1}
            </div>
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {step.title}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {step.desc}
            </div>
            {i < steps.length - 1 && (
              <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 pointer-events-none" aria-hidden="true">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
