"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

type HouseStatus = "no-house" | "first-time" | "1house-non-adjusted" | "1house-adjusted" | "multi";

const HOUSE_STATUS_LABEL: Record<HouseStatus, string> = {
  "no-house": "무주택자",
  "first-time": "생애최초",
  "1house-non-adjusted": "1주택자 (비조정대상)",
  "1house-adjusted": "1주택자 (조정대상)",
  multi: "다주택자",
};

// 보유 상태별 권장 LTV율 (2026년 기준, 일반 주담대)
const RECOMMENDED_LTV: Record<HouseStatus, number> = {
  "no-house": 70,
  "first-time": 80,
  "1house-non-adjusted": 70,
  "1house-adjusted": 50,
  multi: 30,
};

// 산정 만기 (DSR 산정용)
const TENURE = {
  newMortgage: 30, // 신규 주담대
  existingMortgage: 30, // 기존 주담대
  credit: 5, // 신용대출
  auto: 5, // 자동차할부 (잔존 평균)
  cardLoan: 3, // 카드론
};

const RATE = 0.045; // 산정 금리 4.5% (2026 평균)

// 원리금 균등 연 상환액 (대출 1억 기준)
function annualPaymentPer1eok(years: number, rate: number = RATE): number {
  const monthlyRate = rate / 12;
  const months = years * 12;
  const monthly =
    (100_000_000 * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return monthly * 12;
}

function fmt(n: number, d = 0): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function LtvDtiPage() {
  const [housePrice, setHousePrice] = useState("500000000");
  const [annualIncome, setAnnualIncome] = useState("60000000");
  const [houseStatus, setHouseStatus] = useState<HouseStatus>("no-house");

  // 기존 대출 종류별
  const [existingMortgage, setExistingMortgage] = useState("0");
  const [creditLoan, setCreditLoan] = useState("0");
  const [autoLoan, setAutoLoan] = useState("0");
  const [cardLoan, setCardLoan] = useState("0");

  // 한도 설정 (사용자 변경 가능)
  const [ltvLimit, setLtvLimit] = useState(RECOMMENDED_LTV["no-house"].toString());
  const [dsrLimit, setDsrLimit] = useState("40");
  const [newMortgageYears, setNewMortgageYears] = useState("30");

  const result = useMemo(() => {
    const hp = parseFloat(housePrice);
    const ai = parseFloat(annualIncome);
    const mort = parseFloat(existingMortgage) || 0;
    const cr = parseFloat(creditLoan) || 0;
    const ato = parseFloat(autoLoan) || 0;
    const card = parseFloat(cardLoan) || 0;
    const ltv = parseFloat(ltvLimit) / 100;
    const dsr = parseFloat(dsrLimit) / 100;
    const newYears = parseFloat(newMortgageYears) || 30;
    if (!hp || !ai) return null;

    // === LTV 한도 ===
    const ltvMax = hp * ltv;

    // === 기존 대출 연 원리금 합산 (DSR 산정) ===
    const annualMortPay = mort > 0 ? mort * (annualPaymentPer1eok(TENURE.existingMortgage) / 100_000_000) : 0;
    const annualCreditPay = cr > 0 ? cr * (annualPaymentPer1eok(TENURE.credit) / 100_000_000) : 0;
    const annualAutoPay = ato > 0 ? ato * (annualPaymentPer1eok(TENURE.auto) / 100_000_000) : 0;
    const annualCardPay = card > 0 ? card * (annualPaymentPer1eok(TENURE.cardLoan) / 100_000_000) : 0;
    const totalExistingPay = annualMortPay + annualCreditPay + annualAutoPay + annualCardPay;

    // === DSR 한도 ===
    const dsrCapacity = ai * dsr;
    const dsrAvailable = dsrCapacity - totalExistingPay;
    const newMortPayPer1eok = annualPaymentPer1eok(newYears);
    const dsrMax = (dsrAvailable / newMortPayPer1eok) * 100_000_000;

    // === DTI 한도 (신규 주담대만 산정 — 보통 50~60%) ===
    const dtiLimit = 0.5;
    const dtiCapacity = ai * dtiLimit;
    const dtiMax = (dtiCapacity / newMortPayPer1eok) * 100_000_000;

    // 최종 한도 (LTV·DSR·DTI 중 가장 작은 값)
    const finalLimit = Math.min(ltvMax, Math.max(0, dsrMax), Math.max(0, dtiMax));

    // 새 주담대 1억당 연 원리금 (참고용)
    const newMonthly = newMortPayPer1eok / 12;

    // 현재 DSR 비율 (기존 대출만)
    const currentDsrRate = (totalExistingPay / ai) * 100;

    return {
      ltvMax,
      dsrMax: Math.max(0, dsrMax),
      dtiMax: Math.max(0, dtiMax),
      finalLimit,
      totalExistingPay,
      annualMortPay,
      annualCreditPay,
      annualAutoPay,
      annualCardPay,
      newMonthly,
      currentDsrRate,
      dsrCapacity,
    };
  }, [housePrice, annualIncome, houseStatus, existingMortgage, creditLoan, autoLoan, cardLoan, ltvLimit, dsrLimit, newMortgageYears]);

  // 정책대출 자격 진단
  const policyEligibility = useMemo(() => {
    const hp = parseFloat(housePrice);
    const ai = parseFloat(annualIncome);
    if (!hp || !ai) return [];
    const eligible: { name: string; rate: string; limit: string; note?: string }[] = [];

    if (hp <= 600_000_000 && ai <= 70_000_000 && houseStatus === "no-house") {
      eligible.push({
        name: "디딤돌 대출",
        rate: "2.15~3.0%",
        limit: "최대 4.2억",
        note: "무주택 + 6억 이하 + 부부 합산 6천(생애최초 7천) 이하",
      });
    }
    if (hp <= 900_000_000 && houseStatus === "no-house") {
      eligible.push({
        name: "보금자리론",
        rate: "3.85~4.95%",
        limit: "최대 5억",
        note: "무주택 + 9억 이하",
      });
    }
    if (hp <= 900_000_000 && (houseStatus === "no-house" || houseStatus === "first-time")) {
      eligible.push({
        name: "신생아 특례 대출",
        rate: "1.6~3.3%",
        limit: "최대 5억",
        note: "자녀 출생 2년 이내 + 9억 이하 (소득 ≤ 부부 1.3억)",
      });
    }
    return eligible;
  }, [housePrice, annualIncome, houseStatus]);

  return (
    <CalculatorLayout
      title="LTV·DTI·DSR 계산기"
      description="주택가·소득·기존 대출(종류별)로 LTV·DTI·DSR 한도 정확 계산. 산정 만기 차등 적용 (주담대 30년·신용 5년·할부 5년·카드론 3년). 정책대출 자격 자동 진단."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">주택 가격 (원)</span>
            <input
              type="number"
              min="0"
              value={housePrice}
              onChange={(e) => setHousePrice(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
            />
            <MoneyHint value={housePrice} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">연 소득 (원)</span>
            <input
              type="number"
              min="0"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            />
            <MoneyHint value={annualIncome} />
            <span className="block mt-1 text-xs text-slate-500">부부 공동명의면 합산 소득</span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">보유 상태</span>
            <select
              value={houseStatus}
              onChange={(e) => {
                const v = e.target.value as HouseStatus;
                setHouseStatus(v);
                setLtvLimit(RECOMMENDED_LTV[v].toString());
              }}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3"
            >
              {Object.entries(HOUSE_STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <span className="block mt-1 text-xs text-emerald-600">권장 LTV {RECOMMENDED_LTV[houseStatus]}% 자동 적용</span>
          </label>
        </div>

        {/* 기존 대출 종류별 */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📋 기존 대출 (종류별)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">주담대 잔액 (원, 30년 산정)</span>
              <input
                type="number"
                min="0"
                value={existingMortgage}
                onChange={(e) => setExistingMortgage(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">신용대출 잔액 (원, 5년 산정)</span>
              <input
                type="number"
                min="0"
                value={creditLoan}
                onChange={(e) => setCreditLoan(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">자동차 할부 잔액 (원, 5년 산정)</span>
              <input
                type="number"
                min="0"
                value={autoLoan}
                onChange={(e) => setAutoLoan(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">카드론·기타 잔액 (원, 3년 산정)</span>
              <input
                type="number"
                min="0"
                value={cardLoan}
                onChange={(e) => setCardLoan(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </label>
          </div>
          <span className="block mt-2 text-xs text-slate-500">
            ※ DSR 산정은 대출 종류별 다른 만기 적용. 산정 금리 4.5% (2026 평균).
          </span>
        </div>

        {/* 한도 설정 */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">⚙️ 한도·상환 조건</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">LTV 한도 (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={ltvLimit}
                onChange={(e) => setLtvLimit(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">DSR 한도 (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={dsrLimit}
                onChange={(e) => setDsrLimit(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
              <span className="block mt-0.5 text-xs text-slate-400">1금융권 40·2금융권 50</span>
            </label>
            <label className="block">
              <span className="text-xs text-slate-600 dark:text-slate-400">신규 주담대 만기 (년)</span>
              <input
                type="number"
                min="1"
                max="50"
                value={newMortgageYears}
                onChange={(e) => setNewMortgageYears(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              />
              <span className="block mt-0.5 text-xs text-slate-400">표준 30년 / 일부 40년</span>
            </label>
          </div>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            {/* 최종 한도 */}
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-5 text-center">
              <div className="text-sm text-indigo-700 dark:text-indigo-400 mb-1">실제 가능 대출 한도</div>
              <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">{fmt(result.finalLimit)} 원</div>
              <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">LTV·DTI·DSR 중 가장 작은 한도 적용</div>
              {result.currentDsrRate > 0 && (
                <div className="mt-3 text-xs">
                  현재 기존 대출 DSR: <strong className={result.currentDsrRate > 30 ? "text-rose-600" : "text-emerald-600"}>
                    {result.currentDsrRate.toFixed(1)}%
                  </strong>
                  {" "} / 한도 {dsrLimit}%
                </div>
              )}
            </div>

            {/* 3가지 한도 비교 */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4">
                <div className="text-xs text-slate-500">LTV 한도</div>
                <div className="font-bold text-lg">{fmt(result.ltvMax)} 원</div>
                <div className="text-xs text-slate-400 mt-1">{ltvLimit}% × 주택가</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4">
                <div className="text-xs text-slate-500">DTI 한도</div>
                <div className="font-bold text-lg">{fmt(result.dtiMax)} 원</div>
                <div className="text-xs text-slate-400 mt-1">50% × 연소득</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-4">
                <div className="text-xs text-slate-500">DSR 한도</div>
                <div className="font-bold text-lg">{fmt(result.dsrMax)} 원</div>
                <div className="text-xs text-slate-400 mt-1">{dsrLimit}% - 기존 대출</div>
              </div>
            </div>

            {/* DSR 세부 — 기존 대출 부담 */}
            {result.totalExistingPay > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">📊 기존 대출 DSR 부담 (연 원리금)</h3>
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-4 space-y-1 text-sm">
                  {result.annualMortPay > 0 && (
                    <div className="flex justify-between">
                      <span>주담대 (30년 산정)</span>
                      <span>{fmt(result.annualMortPay)}원/년</span>
                    </div>
                  )}
                  {result.annualCreditPay > 0 && (
                    <div className="flex justify-between">
                      <span>신용대출 (5년 산정)</span>
                      <span>{fmt(result.annualCreditPay)}원/년</span>
                    </div>
                  )}
                  {result.annualAutoPay > 0 && (
                    <div className="flex justify-between">
                      <span>자동차할부 (5년 산정)</span>
                      <span>{fmt(result.annualAutoPay)}원/년</span>
                    </div>
                  )}
                  {result.annualCardPay > 0 && (
                    <div className="flex justify-between">
                      <span>카드론·기타 (3년 산정)</span>
                      <span>{fmt(result.annualCardPay)}원/년</span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-rose-200 dark:border-rose-800 flex justify-between font-bold">
                    <span>합계</span>
                    <span>{fmt(result.totalExistingPay)}원/년</span>
                  </div>
                  <div className="text-xs text-rose-700 dark:text-rose-400 mt-1">
                    잔여 DSR 가능 = {fmt(result.dsrCapacity)} - {fmt(result.totalExistingPay)} = {fmt(result.dsrCapacity - result.totalExistingPay)}원/년
                  </div>
                </div>
              </div>
            )}

            {/* 신규 주담대 월 상환액 (참고) */}
            <div className="mt-5 rounded-xl bg-amber-50 dark:bg-amber-950 p-4 text-sm">
              <strong>💡 참고</strong>: 최종 한도 {fmt(result.finalLimit)}원 / 만기 {newMortgageYears}년 / 4.5% 가정 시
              {" "}월 상환 약 <strong>{fmt((result.finalLimit / 100_000_000) * result.newMonthly)} 원</strong>
            </div>
          </div>
        )}

        {/* 정책대출 자격 진단 */}
        {policyEligibility.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
              🎯 정책대출 자격 진단 (DSR 면제 + 우대 금리)
            </h3>
            <div className="space-y-2">
              {policyEligibility.map((p) => (
                <div key={p.name} className="rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">{p.name}</span>
                    <span className="text-sm">
                      <span className="text-emerald-700 font-semibold">{p.rate}</span>
                      {" · "}
                      <span>{p.limit}</span>
                    </span>
                  </div>
                  {p.note && <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">{p.note}</div>}
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              ※ 정책대출은 DSR 산정에서 제외. 자격되면 일반 주담대보다 1~2%p 저렴.{" "}
              <a href="https://nhuf.molit.go.kr" target="_blank" rel="noreferrer" className="text-indigo-600 underline">주택도시기금</a>에서 정확한 자격 진단.
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">📌 LTV·DTI·DSR 정확도</h2>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-4 space-y-2 text-xs">
          <div>
            <strong>LTV</strong>: 주택가 × LTV율 (무주택 70·1주택 비조정 70·조정 50·다주택 0~30·생애최초 80)
          </div>
          <div>
            <strong>DTI</strong>: 연 소득 × 50% / 신규 주담대 연 원리금 비율 — 신규 주담대만 산정
          </div>
          <div>
            <strong>DSR</strong>: 연 소득 × 40% (1금융) / 50% (2금융) - **모든 기존 대출 연 원리금**
            <br />
            기존 대출별 산정 만기: 주담대 30·신용 5·자동차할부 5·카드론 3년
            <br />
            산정 금리 4.5% (2026 평균)
          </div>
          <div>
            <strong>실제 한도</strong>: LTV·DTI·DSR 중 가장 작은 값. 2024년 이후 DSR이 가장 엄격한 경우 多.
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        ⚠️ <strong>참고</strong>: 본 도구는 \"가계부채 관리방안\" 기준 표준 산정 만기·금리로 계산. 실제 은행 가심사는 신용 등급·DSR 산정 기준·정책에 따라 ±10% 차이 가능. 본격 매수 전엔 2~3개 은행 가심사 권장.
      </div>
    </CalculatorLayout>
  );
}
