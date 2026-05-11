"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

const BRACKETS = [
  { upTo: 100_000_000, rate: 0.10, ded: 0 },
  { upTo: 500_000_000, rate: 0.20, ded: 10_000_000 },
  { upTo: 1_000_000_000, rate: 0.30, ded: 60_000_000 },
  { upTo: 3_000_000_000, rate: 0.40, ded: 160_000_000 },
  { upTo: Infinity, rate: 0.50, ded: 460_000_000 },
];

const RELATION_DEDUCTION: Record<string, number> = {
  spouse: 600_000_000,
  adult_child: 50_000_000,
  minor_child: 20_000_000,
  other_relative: 10_000_000,
  unrelated: 0,
};

const RELATION_LABEL: Record<string, string> = {
  spouse: "배우자",
  adult_child: "직계비속 (성인)",
  minor_child: "직계비속 (미성년)",
  other_relative: "기타 친족",
  unrelated: "친족 외",
};

export default function GiftTaxPage() {
  const [amount, setAmount] = useState("100000000");
  const [relation, setRelation] = useState("adult_child");
  const [marriageBirth, setMarriageBirth] = useState(false);
  const [prior10y, setPrior10y] = useState("0"); // 동일인 10년 내 증여액

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const prior = parseFloat(prior10y) || 0;
    if (!a || a <= 0) return null;
    const baseDed = RELATION_DEDUCTION[relation] || 0;
    // 2024 신설: 직계존속 → 자녀 혼인·출산 시 1억 추가 공제 (성인 자녀만)
    const extraDed = marriageBirth && (relation === "adult_child" || relation === "minor_child") ? 100_000_000 : 0;
    const ded = baseDed + extraDed;

    // 10년 누적: 동일인 합산 후 과세 → 기존 증여세 공제
    const cumAmount = a + prior;
    const taxBase = Math.max(0, cumAmount - ded);
    const b = BRACKETS.find((x) => taxBase <= x.upTo)!;
    const cumGrossTax = Math.max(0, taxBase * b.rate - b.ded);

    // 과거 10년 증여분의 산출세액 (기납부세액공제)
    const priorTaxBase = Math.max(0, prior - ded);
    let priorTax = 0;
    if (priorTaxBase > 0) {
      const priorBracket = BRACKETS.find((x) => priorTaxBase <= x.upTo)!;
      priorTax = Math.max(0, priorTaxBase * priorBracket.rate - priorBracket.ded);
    }

    const grossTax = Math.max(0, cumGrossTax - priorTax);
    // 신고세액공제 3% (자진 신고 기간 내)
    const reportCredit = grossTax * 0.03;
    const tax = grossTax - reportCredit;
    return { ded, baseDed, extraDed, taxBase, cumAmount, prior, priorTax, cumGrossTax, grossTax, reportCredit, tax };
  }, [amount, relation, marriageBirth, prior10y]);

  return (
    <CalculatorLayout title="증여세 계산기" description="증여재산·관계별 공제 (배우자 6억·성인자녀 5천만원 등) 자동 적용 후 누진세 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">증여재산 (원)</span><input type="number"
              min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={amount} /></label>
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">증여 관계</span>
            <select value={relation} onChange={(e) => setRelation(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
              {Object.entries(RELATION_LABEL).map(([k, v]) => <option key={k} value={k}>{v} (공제 {fmt(RELATION_DEDUCTION[k])} 원)</option>)}
            </select>
          </label>
          {(relation === "adult_child" || relation === "minor_child") && (
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-300 hover:border-indigo-400 sm:col-span-2">
              <input type="checkbox" checked={marriageBirth} onChange={(e) => setMarriageBirth(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">혼인·출산 추가공제 1억 적용 (2024 신설, 직계존속 → 자녀 한정)</span>
            </label>
          )}
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">동일인 과거 10년 내 증여액 (원)</span>
            <input
              type="number"
              min="0"
              value={prior10y}
              onChange={(e) => setPrior10y(e.target.value)}
              placeholder="없으면 0"
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3"
            />
            <MoneyHint value={prior10y} />
            <span className="block mt-1 text-xs text-slate-500">
              증여세는 10년 단위 합산 과세 — 동일 증여자(예: 같은 부모)에게서 받은 과거 증여액 입력 시 정확
            </span>
          </label>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">예상 증여세 (신고세액공제 3% 적용 후)</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.tax)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">공제 합계: {fmt(result.ded)} 원 / 과세표준: {fmt(result.taxBase)} 원</div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span>기본 공제 ({RELATION_LABEL[relation]})</span><span>{fmt(result.baseDed)} 원</span></div>
              {result.extraDed > 0 && (
                <div className="flex justify-between py-2 border-b border-slate-100 text-emerald-600"><span>혼인·출산 추가공제</span><span>+{fmt(result.extraDed)} 원</span></div>
              )}
              {result.prior > 0 && (
                <>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>10년 누적 증여액</span>
                    <span>{fmt(result.cumAmount)} 원</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>누적 산출세액</span>
                    <span>{fmt(result.cumGrossTax)} 원</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-emerald-600">
                    <span>기납부 증여세 차감</span>
                    <span>-{fmt(result.priorTax)} 원</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-2 border-b border-slate-100"><span>산출 증여세</span><span>{fmt(result.grossTax)} 원</span></div>
              <div className="flex justify-between py-2 text-emerald-600"><span>신고세액공제 (3%)</span><span>-{fmt(result.reportCredit)} 원</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <p className="text-xs">※ 10년간 동일인 증여 합산 적용. 신고기한 3개월 (자진 신고 시 3% 세액공제). 부부간 6억·성인자녀 5천·미성년 2천·기타친족 1천 (10년 합산). 혼인·출산 1억 추가공제는 직계존속 → 자녀로 혼인일 또는 출생일 전후 2년 이내 증여만 적용.</p>
      </div>
    </CalculatorLayout>
  );
}
