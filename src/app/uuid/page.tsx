"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function uuidv4(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidPage() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) arr.push(uuidv4());
    setUuids(arr);
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <CalculatorLayout title="UUID 생성기" description="UUID v4 즉시 생성 (1~100개 일괄). 브라우저 crypto.randomUUID 사용, 서버 전송 X.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">생성 개수: {count}</span>
          <input type="range" min="1" max="100" value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="mt-1.5 block w-full" />
        </label>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button onClick={handleGenerate} className="bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">생성</button>
          <button onClick={handleCopyAll} className="bg-slate-100 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-200 transition">{copied === -1 ? "✓ 모두 복사됨" : "전체 복사"}</button>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-1.5 max-h-[400px] overflow-y-auto">
          {uuids.map((u, i) => (
            <button key={i} onClick={() => handleCopy(u, i)} className="w-full text-left rounded-lg bg-slate-900 px-3 py-2 font-mono text-xs text-emerald-400 hover:bg-slate-800 transition">
              {copied === i ? "✓ 복사됨" : u}
            </button>
          ))}
        </div>
      </div>
    </CalculatorLayout>
  );
}
