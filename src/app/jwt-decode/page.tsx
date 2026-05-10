"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

function b64UrlDecode(s: string): string {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return decodeURIComponent(escape(atob(s)));
}

export default function JwtDecodePage() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNhbGNrciIsImlhdCI6MTczMzAwMDAwMH0.signature"
  );

  const result = useMemo(() => {
    const parts = token.split(".");
    if (parts.length !== 3) return { error: "JWT는 header.payload.signature 3개 부분으로 구성돼야 합니다." };
    try {
      const header = JSON.parse(b64UrlDecode(parts[0]));
      const payload = JSON.parse(b64UrlDecode(parts[1]));
      return { header, payload, signature: parts[2] };
    } catch (e) {
      return { error: `디코딩 오류: ${(e as Error).message}` };
    }
  }, [token]);

  return (
    <CalculatorLayout title="JWT 디코더" description="JWT 토큰의 header·payload·signature 즉시 분석. 서버 전송 X (브라우저에서 처리).">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">JWT 토큰</span>
          <textarea value={token} onChange={(e) => setToken(e.target.value)} rows={4} className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 break-all" />
        </label>
        {result.error && <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{result.error}</div>}
        {!result.error && (
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Header</div>
              <pre className="rounded-lg bg-rose-50 p-3 font-mono text-xs text-rose-900 overflow-x-auto">{JSON.stringify(result.header, null, 2)}</pre>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Payload</div>
              <pre className="rounded-lg bg-emerald-50 p-3 font-mono text-xs text-emerald-900 overflow-x-auto">{JSON.stringify(result.payload, null, 2)}</pre>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Signature (검증용)</div>
              <pre className="rounded-lg bg-sky-50 p-3 font-mono text-xs text-sky-900 break-all whitespace-pre-wrap">{result.signature}</pre>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
