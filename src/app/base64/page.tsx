"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function b64Encode(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

function b64Decode(s: string): string {
  try {
    return decodeURIComponent(escape(atob(s)));
  } catch {
    return "";
  }
}

export default function Base64Page() {
  const [text, setText] = useState("calai 한국 도구 모음");
  const [b64, setB64] = useState(b64Encode("calai 한국 도구 모음"));
  const [err, setErr] = useState("");

  const handleEncode = (v: string) => {
    setText(v);
    try {
      setB64(b64Encode(v));
      setErr("");
    } catch (e) {
      setErr(String(e));
    }
  };

  const handleDecode = (v: string) => {
    setB64(v);
    try {
      const decoded = b64Decode(v);
      setText(decoded);
      setErr("");
    } catch {
      setErr("Base64 디코딩 실패");
    }
  };

  return (
    <CalculatorLayout title="Base64 인코딩·디코딩" description="문자열 ↔ Base64 양방향 변환. UTF-8 한글 지원.">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">일반 텍스트</span>
          <textarea value={text} onChange={(e) => handleEncode(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        <div className="text-center text-2xl text-slate-400 my-3">⇅</div>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Base64</span>
          <textarea value={b64} onChange={(e) => handleDecode(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </label>
        {err && <div className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{err}</div>}
      </div>
    </CalculatorLayout>
  );
}
