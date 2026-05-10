"use client";

import { useState, useMemo, useEffect } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const CURRENCIES = [
  { code: "KRW", name: "한국 원", flag: "🇰🇷" },
  { code: "USD", name: "미국 달러", flag: "🇺🇸" },
  { code: "EUR", name: "유로", flag: "🇪🇺" },
  { code: "JPY", name: "일본 엔", flag: "🇯🇵" },
  { code: "CNY", name: "중국 위안", flag: "🇨🇳" },
  { code: "GBP", name: "영국 파운드", flag: "🇬🇧" },
  { code: "AUD", name: "호주 달러", flag: "🇦🇺" },
  { code: "CAD", name: "캐나다 달러", flag: "🇨🇦" },
  { code: "CHF", name: "스위스 프랑", flag: "🇨🇭" },
  { code: "HKD", name: "홍콩 달러", flag: "🇭🇰" },
  { code: "SGD", name: "싱가포르 달러", flag: "🇸🇬" },
  { code: "NZD", name: "뉴질랜드 달러", flag: "🇳🇿" },
  { code: "THB", name: "태국 바트", flag: "🇹🇭" },
  { code: "MYR", name: "말레이시아 링깃", flag: "🇲🇾" },
  { code: "INR", name: "인도 루피", flag: "🇮🇳" },
  { code: "IDR", name: "인도네시아 루피아", flag: "🇮🇩" },
  { code: "PHP", name: "필리핀 페소", flag: "🇵🇭" },
  { code: "MXN", name: "멕시코 페소", flag: "🇲🇽" },
  { code: "BRL", name: "브라질 헤알", flag: "🇧🇷" },
  { code: "SEK", name: "스웨덴 크로나", flag: "🇸🇪" },
  { code: "NOK", name: "노르웨이 크로나", flag: "🇳🇴" },
  { code: "DKK", name: "덴마크 크로나", flag: "🇩🇰" },
  { code: "TRY", name: "터키 리라", flag: "🇹🇷" },
  { code: "ZAR", name: "남아공 랜드", flag: "🇿🇦" },
  { code: "PLN", name: "폴란드 즈워티", flag: "🇵🇱" },
];

function fmt(n: number, d = 2): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function ExchangePage() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KRW");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [manualRate, setManualRate] = useState<string>("");
  const [manualEdit, setManualEdit] = useState(false);

  useEffect(() => {
    if (manualEdit) return;
    let cancelled = false;
    const fetchRates = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/exchange?base=${from}`);
        if (!res.ok) throw new Error(`서버 응답 ${res.status}`);
        const data: { rates: Record<string, number>; date: string; source: string } = await res.json();
        if (!data.rates || Object.keys(data.rates).length === 0) throw new Error("환율 데이터 없음");
        if (!cancelled) {
          setRates({ ...data.rates, [from]: 1 });
          setUpdatedAt(`${data.date} · ${data.source}`);
        }
      } catch (e) {
        if (!cancelled) setError(`조회 실패: ${(e as Error).message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRates();
    return () => { cancelled = true; };
  }, [from, manualEdit]);

  const rate = useMemo(() => {
    if (manualEdit && manualRate) return parseFloat(manualRate);
    return rates[to] || 0;
  }, [rates, to, manualEdit, manualRate]);

  const result = useMemo(() => {
    const a = parseFloat(amount);
    if (!a || !rate || a < 0) return null;
    return a * rate;
  }, [amount, rate]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setManualEdit(false);
  };

  return (
    <CalculatorLayout title="환율 변환기 (실시간)" description="25개 통화 양방향 변환. ECB·Open ER 실시간 환율 + 직접 입력 가능.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">From</span>
              <select value={from} onChange={(e) => { setFrom(e.target.value); setManualEdit(false); }} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base">
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
              </select>
            </label>
            <input type="number" min="0" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-2xl font-semibold" />
            <div className="flex gap-1.5 mt-1.5">
              {[1, 10, 100, 1000, 10000].map((v) => (
                <button key={v} onClick={() => setAmount(String(v))} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition">{v.toLocaleString()}</button>
              ))}
            </div>
          </div>

          <button onClick={swap} className="self-center mb-12 sm:mb-12 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition flex items-center justify-center text-2xl font-bold" title="From ↔ To 전환">
            ⇄
          </button>

          <div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">To</span>
              <select value={to} onChange={(e) => { setTo(e.target.value); setManualEdit(false); }} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base">
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
              </select>
            </label>
            <div className="mt-2 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950 px-4 py-3 text-2xl font-bold text-indigo-900 dark:text-indigo-300">
              {result !== null ? fmt(result, 2) : "—"}
            </div>
            <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {loading && <span className="text-indigo-500 animate-pulse">조회 중...</span>}
              {!loading && rate > 0 && (
                <>1 {from} = {fmt(rate, 4)} {to}</>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <label className="block">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">환율 직접 입력 (옵션)</span>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={manualEdit ? manualRate : (rate ? rate.toFixed(4) : "")}
              onChange={(e) => { setManualRate(e.target.value); setManualEdit(true); }}
              placeholder={`1 ${from} = ? ${to}`}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
            {manualEdit && (
              <button onClick={() => { setManualEdit(false); setManualRate(""); }} className="mt-1 text-xs text-indigo-600 hover:underline">실시간 환율로 복귀</button>
            )}
          </label>
          {!manualEdit && updatedAt && (
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">✓ {updatedAt}</div>
          )}
          {error && <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">{error}</div>}
        </div>
      </div>

      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base">실시간 환율 출처</h2>
        <p className="text-xs">
          유럽중앙은행(ECB)의 Reference Rates 기반. 매일 16시(CET) 갱신. 한국수출입은행 매매기준율과 ±0.5% 오차 가능.
          실거래 시 은행별 우대율(보통 90~95%)·트래블카드 우대율 100% 적용 가능.
        </p>
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-base mt-4">지원 통화 (25개)</h2>
        <p className="text-xs">
          KRW·USD·EUR·JPY·CNY·GBP·AUD·CAD·CHF·HKD·SGD·NZD·THB·MYR·INR·IDR·PHP·MXN·BRL·SEK·NOK·DKK·TRY·ZAR·PLN
        </p>
      </div>
    </CalculatorLayout>
  );
}
