"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function generate(length: number, opts: { lower: boolean; upper: boolean; numbers: boolean; symbols: boolean }): string {
  let charset = "";
  if (opts.lower) charset += LOWER;
  if (opts.upper) charset += UPPER;
  if (opts.numbers) charset += NUMBERS;
  if (opts.symbols) charset += SYMBOLS;
  if (!charset) return "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let pwd = "";
  for (let i = 0; i < length; i++) pwd += charset[arr[i] % charset.length];
  return pwd;
}

export default function PasswordPage() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setPassword(generate(length, opts));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <CalculatorLayout title="비밀번호 생성기" description="길이·문자 종류 선택해 안전한 비밀번호 즉시 생성 (브라우저 crypto API, 서버 전송 X).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">길이: {length}</span>
          <input type="range" min="6" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="mt-1.5 block w-full" />
        </label>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {(["lower", "upper", "numbers", "symbols"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-300 hover:border-indigo-400">
              <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm">{k === "lower" ? "소문자 (a-z)" : k === "upper" ? "대문자 (A-Z)" : k === "numbers" ? "숫자 (0-9)" : "특수문자"}</span>
            </label>
          ))}
        </div>
        <button onClick={handleGenerate} className="w-full mt-5 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">생성하기</button>
        {password && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="rounded-xl bg-slate-900 p-4 font-mono text-sm break-all text-emerald-400">{password}</div>
            <button onClick={handleCopy} className="w-full mt-3 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition">{copied ? "✓ 복사됨" : "복사하기"}</button>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
