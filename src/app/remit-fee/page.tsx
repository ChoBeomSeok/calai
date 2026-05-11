"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Currency = { code: string; name: string; flag: string };

const CURRENCIES: Currency[] = [
  { code: "USD", name: "미국 달러", flag: "🇺🇸" },
  { code: "JPY", name: "일본 엔", flag: "🇯🇵" },
  { code: "EUR", name: "유로", flag: "🇪🇺" },
  { code: "CNY", name: "중국 위안", flag: "🇨🇳" },
  { code: "GBP", name: "영국 파운드", flag: "🇬🇧" },
  { code: "AUD", name: "호주 달러", flag: "🇦🇺" },
  { code: "CAD", name: "캐나다 달러", flag: "🇨🇦" },
  { code: "PHP", name: "필리핀 페소", flag: "🇵🇭" },
  { code: "VND", name: "베트남 동", flag: "🇻🇳" },
  { code: "THB", name: "태국 바트", flag: "🇹🇭" },
];

const SERVICES = [
  { name: "시중은행 (KB·신한·하나)", flatFee: 5000, percentFee: 0.5, spreadPct: 1.5 },
  { name: "Wise", flatFee: 0, percentFee: 0.4, spreadPct: 0.4 },
  { name: "Wirebarley (와이어바알리)", flatFee: 0, percentFee: 0.5, spreadPct: 0.5 },
  { name: "Hanpass (한패스)", flatFee: 0, percentFee: 0.4, spreadPct: 0.6 },
  { name: "Western Union", flatFee: 4000, percentFee: 0.3, spreadPct: 2.0 },
];

function fmt(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}

export default function RemitFeePage() {
  const [amount, setAmount] = useState("1000");
  const [currency, setCurrency] = useState("USD");
  const [marketRate, setMarketRate] = useState(1380);
  const [manualRate, setManualRate] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState("");
  const [rateUpdatedAt, setRateUpdatedAt] = useState("");

  // 실시간 환율 fetch (기본 동작)
  useEffect(() => {
    if (manualRate) return;
    let cancelled = false;
    const fetchRate = async () => {
      setRateLoading(true);
      setRateError("");
      try {
        const res = await fetch(`/api/exchange?base=${currency}`);
        if (!res.ok) throw new Error(`서버 ${res.status}`);
        const data: { rates: Record<string, number>; date: string; source: string } = await res.json();
        if (!data.rates?.KRW) throw new Error("KRW 환율 없음");
        if (!cancelled) {
          setMarketRate(data.rates.KRW);
          setRateUpdatedAt(`${data.date} · ${data.source}`);
        }
      } catch (e) {
        if (!cancelled) setRateError(`조회 실패: ${(e as Error).message}`);
      } finally {
        if (!cancelled) setRateLoading(false);
      }
    };
    fetchRate();
    return () => {
      cancelled = true;
    };
  }, [currency, manualRate]);

  const result = useMemo(() => {
    const a = parseFloat(amount) || 0;
    return SERVICES.map((s) => {
      const transferFee = s.flatFee + a * marketRate * (s.percentFee / 100);
      const spreadCost = a * marketRate * (s.spreadPct / 100);
      const totalCost = transferFee + spreadCost;
      const youPay = a * marketRate + totalCost;
      return { ...s, transferFee, spreadCost, totalCost, youPay };
    }).sort((x, y) => x.totalCost - y.totalCost);
  }, [amount, marketRate]);

  const currentCurrency = CURRENCIES.find((c) => c.code === currency);

  return (
    <CalculatorLayout
      title="외환 송금 수수료 비교"
      description="시중은행·Wise·Wirebarley·Hanpass·Western Union 등 송금 서비스별 총 비용 비교. 실시간 환율 자동 적용 (ECB 기준)."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">송금 통화</span>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                setManualRate(false);
              }}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">송금액 ({currency})</span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
            />
          </label>
        </div>

        <label className="block mt-4">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>{currency}/KRW 환율</span>
            {rateLoading && <span className="text-xs text-indigo-500 animate-pulse">실시간 조회 중...</span>}
            {!rateLoading && !manualRate && rateUpdatedAt && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ 실시간 · {rateUpdatedAt}</span>
            )}
            {manualRate && (
              <button
                onClick={() => setManualRate(false)}
                className="text-xs text-indigo-600 hover:underline"
              >
                실시간으로 ↻
              </button>
            )}
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={marketRate}
            onChange={(e) => {
              setMarketRate(parseFloat(e.target.value) || 0);
              setManualRate(true);
            }}
            className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg"
          />
          {rateError && <span className="block mt-1 text-xs text-amber-600">{rateError}</span>}
          <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
            기본값은 ECB(유럽중앙은행) 실시간 환율. 수동 입력 시 \"실시간으로 ↻\" 버튼으로 복귀.
          </span>
        </label>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            💸 송금 서비스별 비용 비교 ({currentCurrency?.flag} {amount} {currency} → 🇰🇷 KRW)
          </div>
          <div className="space-y-2">
            {result.map((r, i) => (
              <div
                key={r.name}
                className={`rounded-xl p-4 ${i === 0 ? "bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-700"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className={`font-semibold ${i === 0 ? "text-emerald-900 dark:text-emerald-300" : "text-slate-900 dark:text-slate-100"}`}>
                    {i === 0 && "🏆 "}
                    {r.name}
                  </div>
                  <div className="font-bold">{fmt(r.totalCost)} 원 비용</div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 grid grid-cols-3 gap-2">
                  <div>수수료: {fmt(r.transferFee)}원</div>
                  <div>환율 스프레드: {fmt(r.spreadCost)}원</div>
                  <div>총 지불액: {fmt(r.youPay)}원</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>참고</strong>: 환율은 ECB 실시간 기준. 각 서비스 평균 수수료·스프레드는 추정치이며 송금 시점·금액·국가에 따라 차이 있습니다. 1만 달러 송금 기준 Wise·Wirebarley가 시중은행 대비 5~10배 저렴.
      </div>
    </CalculatorLayout>
  );
}
