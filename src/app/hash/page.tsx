"use client";

import { useEffect, useState } from "react";
import SparkMD5 from "spark-md5";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "text" | "file" | "hmac";
type HmacAlg = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

const SHA_ALGS: { name: string; subtle: AlgorithmIdentifier }[] = [
  { name: "SHA-1", subtle: "SHA-1" },
  { name: "SHA-256", subtle: "SHA-256" },
  { name: "SHA-384", subtle: "SHA-384" },
  { name: "SHA-512", subtle: "SHA-512" },
];

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function shaHex(data: ArrayBuffer, alg: AlgorithmIdentifier): Promise<string> {
  const digest = await crypto.subtle.digest(alg, data);
  return bufToHex(digest);
}

function md5HexFromBuffer(buf: ArrayBuffer): string {
  const spark = new SparkMD5.ArrayBuffer();
  spark.append(buf);
  return spark.end();
}

async function md5HexFromFile(file: File): Promise<string> {
  const CHUNK = 2 * 1024 * 1024;
  const spark = new SparkMD5.ArrayBuffer();
  let offset = 0;
  while (offset < file.size) {
    const slice = file.slice(offset, offset + CHUNK);
    const buf = await slice.arrayBuffer();
    spark.append(buf);
    offset += CHUNK;
  }
  return spark.end();
}

export default function HashPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("calai 해시 생성기");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [computing, setComputing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hmacKey, setHmacKey] = useState("secret-key");
  const [hmacMsg, setHmacMsg] = useState("calai");
  const [hmacAlg, setHmacAlg] = useState<HmacAlg>("SHA-256");
  const [hmacResult, setHmacResult] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  // 텍스트 모드 — 입력 바뀔 때마다 즉시 계산
  useEffect(() => {
    if (mode !== "text") return;
    let cancelled = false;
    (async () => {
      try {
        const buf = new TextEncoder().encode(text).buffer as ArrayBuffer;
        const md5 = md5HexFromBuffer(buf);
        const results: Record<string, string> = { MD5: md5 };
        for (const a of SHA_ALGS) {
          results[a.name] = await shaHex(buf, a.subtle);
        }
        if (!cancelled) setHashes(results);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text, mode]);

  // HMAC 모드 — 입력 바뀔 때마다 계산
  useEffect(() => {
    if (mode !== "hmac") return;
    let cancelled = false;
    (async () => {
      try {
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          enc.encode(hmacKey),
          { name: "HMAC", hash: hmacAlg },
          false,
          ["sign"]
        );
        const sig = await crypto.subtle.sign("HMAC", key, enc.encode(hmacMsg));
        if (!cancelled) setHmacResult(bufToHex(sig));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hmacKey, hmacMsg, hmacAlg, mode]);

  const handleFile = async (f: File | null) => {
    if (!f) return;
    setFile(f);
    setError("");
    setComputing(true);
    setProgress(0);
    setHashes({});
    try {
      const md5 = await md5HexFromFile(f);
      setProgress(30);
      const buf = await f.arrayBuffer();
      const results: Record<string, string> = { MD5: md5 };
      let i = 0;
      for (const a of SHA_ALGS) {
        results[a.name] = await shaHex(buf, a.subtle);
        i++;
        setProgress(30 + (i / SHA_ALGS.length) * 70);
      }
      setHashes(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setComputing(false);
      setProgress(100);
    }
  };

  const handleCopy = async (name: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(name);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      setError("클립보드 복사 실패");
    }
  };

  const formatSize = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <CalculatorLayout
      title="해시 생성기 (MD5·SHA-1·SHA-256·SHA-512·HMAC)"
      description="텍스트·파일 → MD5·SHA-1·SHA-256·SHA-384·SHA-512 동시 생성. HMAC 서명도 지원. 100% 브라우저 처리, 파일 서버 전송 X."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 모드 탭 */}
        <div className="flex gap-2 mb-5">
          {(
            [
              { id: "text", label: "📝 텍스트" },
              { id: "file", label: "📁 파일" },
              { id: "hmac", label: "🔐 HMAC" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
                mode === t.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 텍스트 모드 */}
        {mode === "text" && (
          <>
            <label className="block mb-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">입력 텍스트</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                spellCheck={false}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 font-mono text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {text.length}자 · {new Blob([text]).size}바이트 (UTF-8)
              </div>
            </label>
            <HashResults hashes={hashes} copied={copied} onCopy={handleCopy} />
          </>
        )}

        {/* 파일 모드 */}
        {mode === "file" && (
          <>
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
                <input type="file" onChange={(e) => handleFile(e.target.files?.[0] || null)} className="hidden" />
                <div className="text-5xl mb-3">📁</div>
                <div className="font-semibold text-slate-700 dark:text-slate-200">
                  파일을 드래그하거나 클릭해서 선택
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  모든 파일 형식 · 100% 브라우저 처리 · 대용량 파일은 시간이 걸릴 수 있어요
                </div>
              </label>
            ) : (
              <>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{file.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatSize(file.size)} · {file.type || "unknown"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setHashes({});
                      setProgress(0);
                    }}
                    className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    ↻ 다른 파일
                  </button>
                </div>
                {computing && (
                  <div className="mb-4">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">해시 계산 중 · {progress.toFixed(0)}%</div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
                <HashResults hashes={hashes} copied={copied} onCopy={handleCopy} />
              </>
            )}
          </>
        )}

        {/* HMAC 모드 */}
        {mode === "hmac" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">알고리즘</span>
                <select
                  value={hmacAlg}
                  onChange={(e) => setHmacAlg(e.target.value as HmacAlg)}
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
                >
                  <option value="SHA-1">HMAC-SHA-1</option>
                  <option value="SHA-256">HMAC-SHA-256</option>
                  <option value="SHA-384">HMAC-SHA-384</option>
                  <option value="SHA-512">HMAC-SHA-512</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">비밀 키</span>
                <input
                  type="text"
                  value={hmacKey}
                  onChange={(e) => setHmacKey(e.target.value)}
                  spellCheck={false}
                  className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 font-mono text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </label>
            </div>
            <label className="block mb-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">메시지</span>
              <textarea
                value={hmacMsg}
                onChange={(e) => setHmacMsg(e.target.value)}
                rows={4}
                spellCheck={false}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 font-mono text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </label>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">HMAC-{hmacAlg}</div>
                <button
                  onClick={() => handleCopy(`HMAC-${hmacAlg}`, hmacResult)}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  {copied === `HMAC-${hmacAlg}` ? "✓ 복사됨" : "📋 복사"}
                </button>
              </div>
              <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all">{hmacResult}</div>
            </div>
          </>
        )}

        {error && (
          <div className="mt-3 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>용도</strong>: 파일 무결성 검증(체크섬), 비밀번호 저장(SHA-256+salt), API 서명(HMAC), 빠른 ID 생성(MD5).
        보안에 민감한 비밀번호는 MD5/SHA-1 단독으로는 사용하지 말고 bcrypt·Argon2를 사용하세요.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 입력 텍스트·파일이 서버로 전송되지 않습니다. 모든 해시 계산은 브라우저 안에서.
      </div>
    </CalculatorLayout>
  );
}

function HashResults({
  hashes,
  copied,
  onCopy,
}: {
  hashes: Record<string, string>;
  copied: string | null;
  onCopy: (name: string, value: string) => void;
}) {
  const order = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];
  return (
    <div className="space-y-2">
      {order
        .filter((k) => hashes[k])
        .map((k) => (
          <div key={k} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{k}</div>
              <button
                onClick={() => onCopy(k, hashes[k])}
                className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                {copied === k ? "✓ 복사됨" : "📋 복사"}
              </button>
            </div>
            <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all">{hashes[k]}</div>
          </div>
        ))}
    </div>
  );
}
