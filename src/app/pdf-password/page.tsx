"use client";

import { useEffect, useRef, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import { encryptPdf, decryptPdf, preloadQpdf } from "@/lib/qpdfWasm";

type Mode = "encrypt" | "decrypt";
type Bits = "256" | "128" | "40";

function toArrayBuffer(u: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(u.byteLength);
  new Uint8Array(ab).set(u);
  return ab;
}

export default function PdfPasswordPage() {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [file, setFile] = useState<File | null>(null);
  const [userPwd, setUserPwd] = useState("");
  const [ownerPwd, setOwnerPwd] = useState("");
  const [useSamePwd, setUseSamePwd] = useState(true);
  const [bits, setBits] = useState<Bits>("256");
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showUserPwd, setShowUserPwd] = useState(false);
  const [showOwnerPwd, setShowOwnerPwd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 페이지 진입 시 WASM 사전 로드
  useEffect(() => {
    preloadQpdf();
  }, []);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      setError("PDF 파일만 지원됩니다.");
      return;
    }
    setError("");
    setFile(f);
  };

  const reset = () => {
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const run = async () => {
    if (!file) return;
    if (!userPwd) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }
    setError("");
    setProcessing(true);
    setStage(mode === "encrypt" ? "PDF 잠금 처리 중" : "PDF 잠금 해제 중");
    try {
      const inBytes = new Uint8Array(await file.arrayBuffer());
      const out =
        mode === "encrypt"
          ? await encryptPdf(inBytes, userPwd, useSamePwd ? userPwd : ownerPwd, Number(bits) as 256 | 128 | 40)
          : await decryptPdf(inBytes, userPwd);

      const blob = new Blob([toArrayBuffer(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const base = file.name.replace(/\.pdf$/i, "");
      a.download = mode === "encrypt" ? `${base}_locked.pdf` : `${base}_unlocked.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setStage(mode === "encrypt" ? "✓ 잠금 완료" : "✓ 해제 완료");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStage("");
    } finally {
      setProcessing(false);
    }
  };

  const formatSize = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <CalculatorLayout
      title="PDF 비밀번호 잠금·해제 (AES-256)"
      description="PDF에 AES-256/128 표준 암호 잠금 또는 비밀번호 알고 있는 PDF 해제. qpdf 엔진 기반, Adobe·Chrome·미리보기 모두 호환. 100% 브라우저 처리, 가입·워터마크 없음."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 모드 토글 */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => {
              setMode("encrypt");
              setStage("");
            }}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
              mode === "encrypt"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            🔒 잠금 (암호 추가)
          </button>
          <button
            onClick={() => {
              setMode("decrypt");
              setStage("");
            }}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
              mode === "decrypt"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            🔓 해제 (암호 제거)
          </button>
        </div>

        {/* 파일 업로드 */}
        {!file ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0] || null);
            }}
            className={`block cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition ${
              dragOver
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="text-5xl mb-3">{mode === "encrypt" ? "🔒" : "🔓"}</div>
            <div className="font-semibold text-slate-700 dark:text-slate-200">
              PDF를 드래그하거나 클릭해서 선택
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              100% 브라우저 처리 · 파일·비밀번호는 서버로 전송되지 않습니다
            </div>
          </label>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 mb-4">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{file.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{formatSize(file.size)}</div>
              </div>
              <button
                onClick={reset}
                className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ↻ 다른 파일
              </button>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-3 mb-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {mode === "encrypt" ? "열람 비밀번호 (User Password)" : "비밀번호"}
                </span>
                <div className="mt-1.5 relative">
                  <input
                    type={showUserPwd ? "text" : "password"}
                    value={userPwd}
                    onChange={(e) => setUserPwd(e.target.value)}
                    placeholder={mode === "encrypt" ? "이 PDF를 열 때 입력할 비밀번호" : "PDF 열람용 비밀번호 입력"}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 pr-10 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserPwd(!showUserPwd)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {showUserPwd ? "🙈" : "👁"}
                  </button>
                </div>
              </label>

              {mode === "encrypt" && (
                <>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={useSamePwd}
                      onChange={(e) => setUseSamePwd(e.target.checked)}
                      className="accent-indigo-600"
                    />
                    소유자 비밀번호도 동일하게 설정 (편집·인쇄·복사 제한용)
                  </label>
                  {!useSamePwd && (
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        소유자 비밀번호 (Owner Password)
                      </span>
                      <div className="mt-1.5 relative">
                        <input
                          type={showOwnerPwd ? "text" : "password"}
                          value={ownerPwd}
                          onChange={(e) => setOwnerPwd(e.target.value)}
                          placeholder="편집·인쇄·복사 권한 제한용 비밀번호"
                          className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 pr-10 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOwnerPwd(!showOwnerPwd)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          {showOwnerPwd ? "🙈" : "👁"}
                        </button>
                      </div>
                    </label>
                  )}
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">암호화 강도</span>
                    <select
                      value={bits}
                      onChange={(e) => setBits(e.target.value as Bits)}
                      className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
                    >
                      <option value="256">AES-256 (권장·최강)</option>
                      <option value="128">AES-128 (호환성 우선)</option>
                      <option value="40">RC4-40 (구버전 호환·약함)</option>
                    </select>
                  </label>
                </>
              )}
            </div>

            <button
              onClick={run}
              disabled={processing || !userPwd}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {processing ? stage || "처리 중..." : mode === "encrypt" ? "🔒 PDF 잠그고 다운로드" : "🔓 PDF 해제하고 다운로드"}
            </button>

            {stage && !processing && !error && (
              <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-sm text-emerald-700 dark:text-emerald-400">
                {stage} — 다운로드된 파일을 Adobe Acrobat·Chrome·미리보기 등 모든 표준 PDF 뷰어에서 사용 가능합니다.
              </div>
            )}

            {error && (
              <div className="mt-3 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
                {error}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>두 가지 비밀번호 차이</strong>: <strong>열람 비밀번호</strong>는 PDF를 열 때 필요. <strong>소유자 비밀번호</strong>는 편집·인쇄·복사 제한을 푸는 용도 (열람만 가능 PDF 만들 때 사용). 일반 사용은 둘을 같게 설정하면 됩니다.
      </div>
      <div className="mt-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-700 dark:text-slate-300">
        🛡️ <strong>기술 정보</strong>: qpdf 엔진 (Apache-2.0) WebAssembly 빌드 기반. AES-256은 PDF 1.7 ExtensionLevel 8 표준이며 NIST FIPS-197 인증 알고리즘입니다. 모든 표준 PDF 리더와 호환.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: PDF 파일과 비밀번호가 서버로 전송되지 않습니다. 모든 암호화는 브라우저 안에서.
      </div>
    </CalculatorLayout>
  );
}
