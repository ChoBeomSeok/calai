"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function UrlEncodePage() {
  const [text, setText] = useState("https://calai.kr/검색?q=만 나이");
  const [encoded, setEncoded] = useState(encodeURIComponent("https://calai.kr/검색?q=만 나이"));

  const handleText = (v: string) => {
    setText(v);
    setEncoded(encodeURIComponent(v));
  };

  const handleEncoded = (v: string) => {
    setEncoded(v);
    try { setText(decodeURIComponent(v)); } catch { /* invalid */ }
  };

  return (
    <CalculatorLayout title="URL 인코딩·디코딩" description="URL 특수문자·한글을 % 인코딩 양방향 변환. 쿼리 파라미터·링크 처리 시 필수.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">일반 URL·텍스트</span>
          <textarea value={text} onChange={(e) => handleText(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        <div className="text-center text-2xl text-slate-400 my-3">⇅</div>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">% 인코딩 결과</span>
          <textarea value={encoded} onChange={(e) => handleEncoded(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
      </div>
    </CalculatorLayout>
  );
}
