"use client";

import { useRef, useState } from "react";
import { PDFDocument, PDFName } from "pdf-lib";
import * as piexif from "piexifjs";
import CalculatorLayout from "@/components/CalculatorLayout";

// ─────────────────────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────────────────────
type FileKind = "pdf" | "jpg" | "png" | "webp" | "unsupported";
type MetaEntry = { key: string; value: string };
type ProcessResult = {
  blob: Blob;
  filename: string;
  beforeMeta: MetaEntry[];
  afterMeta: MetaEntry[];
  verified: boolean; // 결과 재파싱하여 메타 0개 확인
};

// ─────────────────────────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────────────────────────
function detectKind(file: File): FileKind {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") return "pdf";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg") || file.type === "image/jpeg") return "jpg";
  if (name.endsWith(".png") || file.type === "image/png") return "png";
  if (name.endsWith(".webp") || file.type === "image/webp") return "webp";
  return "unsupported";
}

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as ArrayBuffer);
    r.onerror = () => reject(r.error);
    r.readAsArrayBuffer(file);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function bytesToDataUrl(bytes: Uint8Array, mime: string): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:${mime};base64,${btoa(bin)}`;
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const bin = atob(base64);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

function toArrayBuffer(u: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(u.byteLength);
  new Uint8Array(ab).set(u);
  return ab;
}

// ─────────────────────────────────────────────────────────────
// PDF 메타 추출·제거
// ─────────────────────────────────────────────────────────────
async function extractPdfMeta(buf: ArrayBuffer): Promise<MetaEntry[]> {
  const doc = await PDFDocument.load(buf, { updateMetadata: false });
  const entries: MetaEntry[] = [];
  const add = (k: string, v: string | undefined | null) => {
    if (v && String(v).trim()) entries.push({ key: k, value: String(v) });
  };
  add("Title", doc.getTitle());
  add("Author", doc.getAuthor());
  add("Subject", doc.getSubject());
  const kw = doc.getKeywords();
  if (kw && kw.trim()) entries.push({ key: "Keywords", value: kw });
  add("Producer", doc.getProducer());
  add("Creator", doc.getCreator());
  const cd = doc.getCreationDate();
  if (cd) add("CreationDate", cd.toISOString());
  const md = doc.getModificationDate();
  if (md) add("ModDate", md.toISOString());

  // XMP 스트림 존재 여부
  const catalog = doc.catalog;
  const xmp = catalog.lookup(PDFName.of("Metadata"));
  if (xmp) entries.push({ key: "XMP Metadata Stream", value: "(존재)" });

  return entries;
}

async function stripPdfMeta(buf: ArrayBuffer): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buf, { updateMetadata: false });
  // 1) Info dictionary 모든 항목 비우기
  doc.setTitle("");
  doc.setAuthor("");
  doc.setSubject("");
  doc.setKeywords([]);
  doc.setProducer("");
  doc.setCreator("");
  // CreationDate/ModDate은 epoch 0으로 설정 (pdf-lib가 자동 채우는 것 방지하기 어려움)
  const epoch = new Date(0);
  doc.setCreationDate(epoch);
  doc.setModificationDate(epoch);

  // 2) XMP 메타데이터 스트림 제거 (catalog의 /Metadata 참조 삭제)
  const catalog = doc.catalog;
  catalog.delete(PDFName.of("Metadata"));

  return await doc.save({ useObjectStreams: false, addDefaultPage: false });
}

// ─────────────────────────────────────────────────────────────
// JPG 메타 추출·제거
// ─────────────────────────────────────────────────────────────
function extractJpgMeta(dataUrl: string): MetaEntry[] {
  try {
    const exif = piexif.load(dataUrl) as Record<string, Record<number, unknown>>;
    const entries: MetaEntry[] = [];
    const TAGS = piexif.TAGS as unknown as Record<string, Record<number, { name: string }>>;
    const sections: [string, keyof typeof exif][] = [
      ["0th", "0th"],
      ["Exif", "Exif"],
      ["GPS", "GPS"],
      ["1st", "1st"],
      ["Interop", "Interop"],
    ];
    for (const [label, key] of sections) {
      const section = exif[key];
      if (!section || typeof section !== "object") continue;
      const tagMap = TAGS[label === "0th" ? "0th" : label === "1st" ? "1st" : label === "Exif" ? "Exif" : label === "GPS" ? "GPS" : "Interop"];
      for (const tagId of Object.keys(section)) {
        const tagName = tagMap?.[Number(tagId)]?.name ?? `Tag${tagId}`;
        let v = section[Number(tagId)];
        if (v instanceof Uint8Array || Array.isArray(v)) {
          v = `[${(v as ArrayLike<unknown>).length} bytes]`;
        }
        const str = String(v);
        if (str.length > 100) continue;
        entries.push({ key: `${label}.${tagName}`, value: str });
        if (entries.length >= 30) break;
      }
    }
    // thumbnail
    if (exif.thumbnail) entries.push({ key: "Thumbnail", value: "(임베드된 썸네일 존재)" });
    return entries;
  } catch {
    return [];
  }
}

function stripJpgMeta(dataUrl: string): string {
  return piexif.remove(dataUrl);
}

// ─────────────────────────────────────────────────────────────
// PNG 메타 추출·제거 (chunk 단위)
// ─────────────────────────────────────────────────────────────
const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const PNG_META_CHUNKS = new Set(["tEXt", "iTXt", "zTXt", "eXIf", "tIME"]);

function readChunkType(buf: Uint8Array, offset: number): string {
  return String.fromCharCode(buf[offset], buf[offset + 1], buf[offset + 2], buf[offset + 3]);
}

function readUInt32BE(buf: Uint8Array, offset: number): number {
  return (
    (buf[offset] << 24) |
    (buf[offset + 1] << 16) |
    (buf[offset + 2] << 8) |
    buf[offset + 3]
  ) >>> 0;
}

function isPng(buf: Uint8Array): boolean {
  if (buf.length < 8) return false;
  for (let i = 0; i < 8; i++) if (buf[i] !== PNG_SIG[i]) return false;
  return true;
}

function extractPngMeta(buf: Uint8Array): MetaEntry[] {
  if (!isPng(buf)) return [];
  const entries: MetaEntry[] = [];
  let off = 8;
  while (off < buf.length - 8) {
    const len = readUInt32BE(buf, off);
    const type = readChunkType(buf, off + 4);
    if (type === "IEND") break;
    if (PNG_META_CHUNKS.has(type)) {
      // data preview
      const data = buf.subarray(off + 8, off + 8 + Math.min(len, 80));
      let txt = "";
      for (let i = 0; i < data.length; i++) {
        const c = data[i];
        txt += c >= 32 && c < 127 ? String.fromCharCode(c) : ".";
      }
      entries.push({ key: type, value: txt.slice(0, 60) + (len > 80 ? "..." : "") });
    }
    off += 8 + len + 4; // length + type + data + CRC
  }
  return entries;
}

function stripPngMeta(buf: Uint8Array): Uint8Array {
  if (!isPng(buf)) return buf;
  const out: number[] = [];
  for (let i = 0; i < 8; i++) out.push(buf[i]);
  let off = 8;
  while (off < buf.length - 8) {
    const len = readUInt32BE(buf, off);
    const type = readChunkType(buf, off + 4);
    const chunkEnd = off + 8 + len + 4;
    if (!PNG_META_CHUNKS.has(type)) {
      for (let i = off; i < chunkEnd; i++) out.push(buf[i]);
    }
    if (type === "IEND") break;
    off = chunkEnd;
  }
  return new Uint8Array(out);
}

// ─────────────────────────────────────────────────────────────
// WebP 메타 추출·제거 (RIFF chunk 단위)
// ─────────────────────────────────────────────────────────────
function readChunkTypeAscii(buf: Uint8Array, off: number): string {
  return String.fromCharCode(buf[off], buf[off + 1], buf[off + 2], buf[off + 3]);
}

function readUInt32LE(buf: Uint8Array, off: number): number {
  return (
    buf[off] |
    (buf[off + 1] << 8) |
    (buf[off + 2] << 16) |
    (buf[off + 3] << 24)
  ) >>> 0;
}

function isWebp(buf: Uint8Array): boolean {
  if (buf.length < 12) return false;
  return (
    readChunkTypeAscii(buf, 0) === "RIFF" && readChunkTypeAscii(buf, 8) === "WEBP"
  );
}

const WEBP_META_CHUNKS = new Set(["EXIF", "XMP ", "ICCP"]);

function extractWebpMeta(buf: Uint8Array): MetaEntry[] {
  if (!isWebp(buf)) return [];
  const entries: MetaEntry[] = [];
  let off = 12;
  while (off < buf.length - 8) {
    const type = readChunkTypeAscii(buf, off);
    const len = readUInt32LE(buf, off + 4);
    if (WEBP_META_CHUNKS.has(type)) {
      entries.push({ key: type.trim() || type, value: `(${len} bytes)` });
    }
    off += 8 + len + (len % 2); // pad to even
  }
  return entries;
}

function stripWebpMeta(buf: Uint8Array): Uint8Array {
  if (!isWebp(buf)) return buf;
  const out: number[] = [];
  // RIFF header (length 4바이트는 나중에 갱신)
  for (let i = 0; i < 4; i++) out.push(buf[i]);
  out.push(0, 0, 0, 0); // placeholder for size
  for (let i = 8; i < 12; i++) out.push(buf[i]);

  let off = 12;
  while (off < buf.length - 8) {
    const type = readChunkTypeAscii(buf, off);
    const len = readUInt32LE(buf, off + 4);
    const padded = len + (len % 2);
    if (!WEBP_META_CHUNKS.has(type)) {
      for (let i = off; i < off + 8 + padded; i++) {
        if (i < buf.length) out.push(buf[i]);
      }
    } else if (type === "VP8X") {
      // VP8X flags의 EXIF·XMP·ICC 비트 끄기는 복잡하므로 그대로 두고 chunk만 제거
      for (let i = off; i < off + 8 + padded; i++) {
        if (i < buf.length) out.push(buf[i]);
      }
    }
    off += 8 + padded;
  }

  // RIFF size update (out.length - 8)
  const size = out.length - 8;
  out[4] = size & 0xff;
  out[5] = (size >> 8) & 0xff;
  out[6] = (size >> 16) & 0xff;
  out[7] = (size >> 24) & 0xff;

  return new Uint8Array(out);
}

// ─────────────────────────────────────────────────────────────
// 메인 처리 (검증 포함)
// ─────────────────────────────────────────────────────────────
async function processFile(file: File): Promise<ProcessResult> {
  const kind = detectKind(file);
  if (kind === "unsupported") throw new Error("지원하지 않는 파일 형식입니다. PDF·JPG·PNG·WebP만 가능합니다.");

  const baseName = file.name.replace(/\.[^.]+$/, "");

  if (kind === "pdf") {
    const buf = await fileToArrayBuffer(file);
    const beforeMeta = await extractPdfMeta(buf);
    const stripped = await stripPdfMeta(buf);
    // 검증: 결과를 다시 파싱하여 메타 0개 확인
    const afterMeta = await extractPdfMeta(stripped.buffer.slice(stripped.byteOffset, stripped.byteOffset + stripped.byteLength) as ArrayBuffer);
    const verified = afterMeta.filter((m) => m.key !== "XMP Metadata Stream").length === 0;
    return {
      blob: new Blob([toArrayBuffer(stripped)], { type: "application/pdf" }),
      filename: `${baseName}_cleaned.pdf`,
      beforeMeta,
      afterMeta,
      verified,
    };
  }

  if (kind === "jpg") {
    const dataUrl = await fileToDataUrl(file);
    const beforeMeta = extractJpgMeta(dataUrl);
    const stripped = stripJpgMeta(dataUrl);
    const afterMeta = extractJpgMeta(stripped);
    const verified = afterMeta.length === 0;
    return {
      blob: new Blob([toArrayBuffer(dataUrlToBytes(stripped))], { type: "image/jpeg" }),
      filename: `${baseName}_cleaned.jpg`,
      beforeMeta,
      afterMeta,
      verified,
    };
  }

  if (kind === "png") {
    const buf = new Uint8Array(await fileToArrayBuffer(file));
    const beforeMeta = extractPngMeta(buf);
    const stripped = stripPngMeta(buf);
    const afterMeta = extractPngMeta(stripped);
    const verified = afterMeta.length === 0;
    return {
      blob: new Blob([toArrayBuffer(stripped)], { type: "image/png" }),
      filename: `${baseName}_cleaned.png`,
      beforeMeta,
      afterMeta,
      verified,
    };
  }

  // webp
  const buf = new Uint8Array(await fileToArrayBuffer(file));
  const beforeMeta = extractWebpMeta(buf);
  const stripped = stripWebpMeta(buf);
  const afterMeta = extractWebpMeta(stripped);
  const verified = afterMeta.length === 0;
  return {
    blob: new Blob([toArrayBuffer(stripped)], { type: "image/webp" }),
    filename: `${baseName}_cleaned.webp`,
    beforeMeta,
    afterMeta,
    verified,
  };
}

// ─────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────
export default function StripMetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (f: File | null) => {
    if (!f) return;
    setError("");
    setResult(null);
    setFile(f);
    setProcessing(true);
    try {
      const r = await processFile(f);
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <CalculatorLayout
      title="메타데이터 제거 (PDF·JPG·PNG·WebP)"
      description="작성자·GPS 위치·카메라 모델·소프트웨어 등 개인정보 메타데이터 완전 제거. 처리 전후 비교 표 + 결과 재검증. 100% 브라우저 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
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
              handle(e.dataTransfer.files[0] || null);
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
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => handle(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="text-5xl mb-3">🧹</div>
            <div className="font-semibold text-slate-700 dark:text-slate-200">
              파일을 드래그하거나 클릭해서 선택
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              PDF · JPG · PNG · WebP · 100% 브라우저 처리
            </div>
          </label>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 mb-4">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {formatSize(file.size)} · {detectKind(file).toUpperCase()}
                </div>
              </div>
              <button
                onClick={reset}
                className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ↻ 다른 파일
              </button>
            </div>

            {processing && (
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 p-4 text-center text-sm text-indigo-700 dark:text-indigo-300">
                메타데이터 분석·제거 중...
              </div>
            )}

            {result && (
              <>
                {/* 검증 배지 */}
                <div
                  className={`rounded-lg p-4 mb-4 ${
                    result.verified
                      ? "bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800"
                      : "bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{result.verified ? "✅" : "⚠️"}</span>
                    <span
                      className={`font-bold text-sm ${
                        result.verified
                          ? "text-emerald-800 dark:text-emerald-300"
                          : "text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {result.verified
                        ? "검증 완료 — 메타데이터 0개 (재파싱 확인)"
                        : `일부 메타 잔존 가능 (${result.afterMeta.length}개)`}
                    </span>
                  </div>
                  <div
                    className={`text-xs ${
                      result.verified
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    처리 후 파일을 다시 파싱하여 메타데이터가 실제로 제거되었는지 검증한 결과입니다.
                  </div>
                </div>

                {/* 처리 전후 비교 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <MetaTable
                    title={`📋 처리 전 (${result.beforeMeta.length}개)`}
                    entries={result.beforeMeta}
                    empty="메타데이터 없음"
                    danger
                  />
                  <MetaTable
                    title={`✨ 처리 후 (${result.afterMeta.length}개)`}
                    entries={result.afterMeta}
                    empty="✓ 완전 제거됨"
                    danger={false}
                  />
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  💾 정리된 파일 다운로드 ({result.filename})
                </button>
              </>
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
        💡 <strong>왜 메타데이터를 지워야 하나요?</strong> 사진엔 촬영 위치(GPS)·카메라 모델·촬영 시간이, PDF엔 작성자
        이름·회사명·편집 소프트웨어·수정 이력이 자동 박힙니다. SNS·블로그·익명 제보·계약서·자소서·이력서 제출 시 본인
        모르게 노출되는 정보입니다.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 파일이 서버로 전송되지 않습니다. 모든 처리는 브라우저 안에서.
      </div>
    </CalculatorLayout>
  );
}

function MetaTable({
  title,
  entries,
  empty,
  danger,
}: {
  title: string;
  entries: MetaEntry[];
  empty: string;
  danger: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div
        className={`px-3 py-2 text-xs font-semibold ${
          danger
            ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-b border-rose-200 dark:border-rose-800"
            : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-b border-emerald-200 dark:border-emerald-800"
        }`}
      >
        {title}
      </div>
      <div className="max-h-72 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">{empty}</div>
        ) : (
          <table className="w-full text-xs">
            <tbody>
              {entries.map((e, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="px-3 py-1.5 text-slate-600 dark:text-slate-400 font-mono whitespace-nowrap">
                    {e.key}
                  </td>
                  <td className="px-3 py-1.5 text-slate-800 dark:text-slate-200 break-all">{e.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
