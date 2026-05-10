"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Category = "length" | "weight" | "temp" | "volume";

const UNITS: Record<Category, { name: string; toBase: number }[]> = {
  length: [
    { name: "mm", toBase: 0.001 },
    { name: "cm", toBase: 0.01 },
    { name: "m", toBase: 1 },
    { name: "km", toBase: 1000 },
    { name: "inch", toBase: 0.0254 },
    { name: "ft", toBase: 0.3048 },
    { name: "yard", toBase: 0.9144 },
    { name: "mile", toBase: 1609.344 },
  ],
  weight: [
    { name: "mg", toBase: 0.000001 },
    { name: "g", toBase: 0.001 },
    { name: "kg", toBase: 1 },
    { name: "ton", toBase: 1000 },
    { name: "oz", toBase: 0.0283495 },
    { name: "lb", toBase: 0.453592 },
    { name: "근(600g)", toBase: 0.6 },
  ],
  temp: [
    { name: "°C", toBase: 1 },
    { name: "°F", toBase: 1 },
    { name: "K", toBase: 1 },
  ],
  volume: [
    { name: "ml", toBase: 0.001 },
    { name: "L", toBase: 1 },
    { name: "cm³", toBase: 0.001 },
    { name: "m³", toBase: 1000 },
    { name: "갤런", toBase: 3.78541 },
  ],
};

function fmt(n: number): string {
  if (Math.abs(n) >= 0.01 && Math.abs(n) < 1_000_000) return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 4 }).format(n);
  return n.toExponential(4);
}

function tempConvert(value: number, from: string, to: string): number {
  let c = 0;
  if (from === "°C") c = value;
  else if (from === "°F") c = (value - 32) * 5 / 9;
  else if (from === "K") c = value - 273.15;
  if (to === "°C") return c;
  if (to === "°F") return c * 9 / 5 + 32;
  return c + 273.15;
}

export default function UnitPage() {
  const [cat, setCat] = useState<Category>("length");
  const [value, setValue] = useState("100");
  const [from, setFrom] = useState("cm");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    return UNITS[cat].map((u) => {
      let conv: number;
      if (cat === "temp") conv = tempConvert(v, from, u.name);
      else {
        const base = v * (UNITS[cat].find((x) => x.name === from)?.toBase || 1);
        conv = base / u.toBase;
      }
      return { name: u.name, value: conv };
    });
  }, [cat, value, from]);

  return (
    <CalculatorLayout title="단위 변환기" description="길이·무게·온도·부피 모든 단위 일괄 변환. 한국 단위 (근 등) 포함.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[{ v: "length", l: "길이" }, { v: "weight", l: "무게" }, { v: "temp", l: "온도" }, { v: "volume", l: "부피" }].map((c) => (
            <button key={c.v} onClick={() => { setCat(c.v as Category); setFrom(UNITS[c.v as Category][0].name); }} className={`px-2 py-2.5 rounded-lg text-sm font-medium border transition ${cat === c.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"}`}>{c.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
            {UNITS[cat].map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </div>
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-2">
            {result.map((r) => (
              <div key={r.name} className={`flex justify-between items-center rounded-lg p-3 ${r.name === from ? "bg-indigo-50" : "bg-slate-50"}`}>
                <span className="text-sm font-medium text-slate-700">{r.name}</span>
                <span className="font-bold">{fmt(r.value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
