"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function QrCodePage() {
  const [text, setText] = useState("https://calai.kr");
  const [size, setSize] = useState(256);

  const qrUrl = useMemo(() => {
    if (!text) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=10`;
  }, [text, size]);

  return (
    <CalculatorLayout title="QR 코드 생성기" description="URL·텍스트·연락처를 QR 코드로 즉시 변환. 다운로드 가능, 크기 조절 자유.">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">텍스트·URL</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-mono" />
        </label>
        <label className="block mt-4">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">크기: {size}px</span>
          <input type="range" min="128" max="512" step="32" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full mt-1" />
        </label>
        {qrUrl && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <img src={qrUrl} alt="QR Code" width={size} height={size} className="mx-auto rounded-lg border border-slate-200 dark:border-slate-700" />
            <a href={qrUrl} download="qrcode.png" className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">⬇ PNG 다운로드</a>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
