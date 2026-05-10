"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function JsonFormatPage() {
  const [input, setInput] = useState('{"name":"calai","tools":40,"category":["health","tax"]}');
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  const format = (indent: number) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError(`JSON 파싱 오류: ${(e as Error).message}`);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(`JSON 파싱 오류: ${(e as Error).message}`);
      setOutput("");
    }
  };

  return (
    <CalculatorLayout title="JSON 포매터" description="JSON 문자열을 들여쓰기·압축·검증. 잘못된 JSON 즉시 감지.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">입력 JSON</span>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button onClick={() => format(2)} className="bg-indigo-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">2칸 들여쓰기</button>
          <button onClick={() => format(4)} className="bg-indigo-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">4칸 들여쓰기</button>
          <button onClick={minify} className="bg-slate-700 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">압축</button>
        </div>
        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
        )}
        {output && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-sm font-medium text-slate-700 mb-2">결과</div>
            <pre className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all">{output}</pre>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-3 w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition">복사</button>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
