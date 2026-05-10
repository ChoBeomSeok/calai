"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Item = { id: number; name: string; price: number; amount: number };

function fmt(n: number, d = 1): string {
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n);
}

export default function UnitPricePage() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "A 상품", price: 10000, amount: 500 },
    { id: 2, name: "B 상품", price: 18000, amount: 1000 },
  ]);
  const [unit, setUnit] = useState<"g" | "ml" | "개">("g");

  const result = useMemo(() => {
    return items.map((it) => {
      const perUnit = it.amount > 0 ? it.price / it.amount : 0;
      return { ...it, perUnit, per100: perUnit * 100 };
    }).sort((a, b) => a.perUnit - b.perUnit);
  }, [items]);

  const update = (id: number, key: keyof Item, val: string | number) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [key]: val } : it)));
  };

  return (
    <CalculatorLayout title="단가 비교 (g당·100g당)" description="여러 상품의 가격·용량 → 단가 자동 비교. 마트·편의점 쇼핑 시 진짜 저렴한 상품 즉시 식별.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {(["g", "ml", "개"] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${unit === u ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}>{u} 기준</button>
          ))}
        </div>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
              <input type="text" value={it.name} onChange={(e) => update(it.id, "name", e.target.value)} placeholder="이름" className="col-span-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
              <input type="number" value={it.price} onChange={(e) => update(it.id, "price", parseFloat(e.target.value) || 0)} placeholder="가격" className="col-span-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
              <input type="number" value={it.amount} onChange={(e) => update(it.id, "amount", parseFloat(e.target.value) || 0)} placeholder={`용량 (${unit})`} className="col-span-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
              <button onClick={() => setItems(items.filter((x) => x.id !== it.id))} className="col-span-1 text-rose-500 text-sm">×</button>
            </div>
          ))}
        </div>
        <button onClick={() => setItems([...items, { id: Date.now(), name: `상품 ${items.length + 1}`, price: 0, amount: 0 }])} className="w-full mt-3 px-3 py-2 rounded-lg border border-dashed border-indigo-300 text-indigo-600 dark:text-indigo-400 text-sm">+ 상품 추가</button>
        {result.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {result.map((r, i) => (
              <div key={r.id} className={`rounded-xl p-4 flex justify-between items-center ${i === 0 ? "bg-emerald-50 dark:bg-emerald-950" : "bg-slate-50 dark:bg-slate-700"}`}>
                <div>
                  <div className={`font-semibold ${i === 0 ? "text-emerald-900 dark:text-emerald-300" : "text-slate-900 dark:text-slate-100"}`}>
                    {i === 0 && "🏆 "}{r.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{fmt(r.price)}원 / {r.amount}{unit}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{fmt(r.perUnit, 2)}원/{unit}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{fmt(r.per100)}원/100{unit}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
