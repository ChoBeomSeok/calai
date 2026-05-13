"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { MoneyHint } from "@/components/MoneyHint";

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type Status = "single" | "two" | "three-plus";

// 2026 기준 추정 (실제 정책 변경 가능)
function calcRate(price: number, _exclusive: number, status: Status): number {
  // 1주택자 단순 누진
  if (status === "single") {
    if (price <= 600_000_000) return 1.0; // 1%
    if (price <= 900_000_000) {
      // 6~9억 비례 누진 — (취득가/1억) × 2/3 - 3
      const priceInBillions = price / 100_000_000;
      const ratio = priceInBillions * (2 / 3) - 3;
      return Math.max(1, Math.min(3, ratio));
    }
    return 3; // 9억 초과 3%
  }
  if (status === "two") return 8;
  return 12;
}

export default function AcquisitionTaxPage() {
  const [price, setPrice] = useState("500000000");
  const [exclusive, setExclusive] = useState("84");
  const [status, setStatus] = useState<Status>("single");

  const result = useMemo(() => {
    const p = parseFloat(price);
    const e = parseFloat(exclusive);
    if (!p || !e) return null;
    const rate = calcRate(p, e, status);
    const acquisitionTax = p * (rate / 100);
    const localEducation = acquisitionTax * 0.10; // 지방교육세 10%
    const ruralSpecial = exclusive && parseFloat(exclusive) > 85 ? p * 0.002 : 0; // 농어촌특별세 0.2% (전용 85㎡ 초과)
    const total = acquisitionTax + localEducation + ruralSpecial;
    return { rate, acquisitionTax, localEducation, ruralSpecial, total };
  }, [price, exclusive, status]);

  return (
    <CalculatorLayout title="취득세 계산기" description="매매가·전용면적·1주택/다주택 기준 취득세 + 지방교육세 + 농어촌특별세 자동 계산.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2"><span className="text-sm font-medium text-slate-700">매매가 (원)</span><input type="number"
              min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /><MoneyHint value={price} /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">전용면적 (㎡)</span><input type="number"
              min="0" value={exclusive} onChange={(e) => setExclusive(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></label>
        </div>
        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700 block mb-2">주택 보유 상태</span>
          <div className="grid grid-cols-3 gap-2">
            {[{ v: "single", l: "1주택" }, { v: "two", l: "2주택" }, { v: "three-plus", l: "3주택+" }].map((s) => (
              <button key={s.v} onClick={() => setStatus(s.v as Status)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${status === s.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{s.l}</button>
            ))}
          </div>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-indigo-50 p-5 text-center">
              <div className="text-sm text-indigo-700 mb-1">총 취득세 (지방교육세·농특세 포함)</div>
              <div className="text-4xl font-bold text-indigo-900">{fmt(result.total)} 원</div>
              <div className="text-xs text-indigo-700 mt-2">취득세율: {result.rate.toFixed(2)}%</div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100"><span>취득세</span><span>{fmt(result.acquisitionTax)} 원</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span>지방교육세 (10%)</span><span>{fmt(result.localEducation)} 원</span></div>
              {result.ruralSpecial > 0 && <div className="flex justify-between py-2"><span>농어촌특별세 (0.2%)</span><span>{fmt(result.ruralSpecial)} 원</span></div>}
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800 text-base mb-2">참고</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>1주택 6억 이하: 1% / 6~9억: 1~3% 누진 / 9억 초과: 3%</li>
          <li>다주택 (조정대상지역) 8~12% 중과세</li>
          <li>전용면적 85㎡ 초과 시 농어촌특별세 0.2% 추가</li>
          <li>실제 신고는 세무사 상담 권장</li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <strong>💡 한국 평균 매매가 (2026 5월)</strong>: 서울 아파트 평균 약 11억 / 수도권 약 6억 / 전국 평균 약 4억
        </div>
      <div className="mt-3 text-[11px] text-slate-400 text-right">
        2026년 지방세법 기준 · 최종 갱신: 2026-05-13
      </div>
    </CalculatorLayout>
  );
}
