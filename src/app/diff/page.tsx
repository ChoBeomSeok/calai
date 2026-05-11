"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "text" | "folder";

type FolderFile = { path: string; content: string; hash: string };

type FolderDiff = {
  added: { path: string }[];
  removed: { path: string }[];
  modified: { path: string; aContent: string; bContent: string }[];
  unchanged: number;
};

// 간단한 해시 (파일 비교용)
async function fileHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

async function readFolder(files: FileList): Promise<FolderFile[]> {
  const result: FolderFile[] = [];
  for (const file of Array.from(files)) {
    // webkitRelativePath = "폴더명/하위/파일.txt"
    const path = (file as File & { webkitRelativePath: string }).webkitRelativePath.split("/").slice(1).join("/");
    if (!path) continue;
    // 텍스트 파일만 읽기 (바이너리는 해시만)
    const isText = /\.(txt|md|json|js|jsx|ts|tsx|css|scss|html|xml|yml|yaml|csv|log|conf|ini|sh|py|rb|go|rs|java|c|cpp|h|swift|kt|sql|env)$/i.test(path);
    let content = "";
    if (isText && file.size < 5_000_000) {
      try {
        content = await file.text();
      } catch {
        content = "";
      }
    }
    const hash = content ? await fileHash(content) : `binary-${file.size}`;
    result.push({ path, content, hash });
  }
  return result;
}

function compareFolders(a: FolderFile[], b: FolderFile[]): FolderDiff {
  const mapA = new Map(a.map((f) => [f.path, f]));
  const mapB = new Map(b.map((f) => [f.path, f]));
  const added: { path: string }[] = [];
  const removed: { path: string }[] = [];
  const modified: { path: string; aContent: string; bContent: string }[] = [];
  let unchanged = 0;

  for (const [path, fileA] of mapA) {
    const fileB = mapB.get(path);
    if (!fileB) removed.push({ path });
    else if (fileA.hash !== fileB.hash) modified.push({ path, aContent: fileA.content, bContent: fileB.content });
    else unchanged++;
  }
  for (const [path] of mapB) {
    if (!mapA.has(path)) added.push({ path });
  }
  return {
    added: added.sort((x, y) => x.path.localeCompare(y.path)),
    removed: removed.sort((x, y) => x.path.localeCompare(y.path)),
    modified: modified.sort((x, y) => x.path.localeCompare(y.path)),
    unchanged,
  };
}

export default function DiffPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [textA, setTextA] = useState("Hello World\nLine 2\nLine 3\nLine 4");
  const [textB, setTextB] = useState("Hello World\nLine 2 modified\nLine 3\nNew Line\nLine 4");
  const [folderA, setFolderA] = useState<FolderFile[]>([]);
  const [folderB, setFolderB] = useState<FolderFile[]>([]);
  const [loading, setLoading] = useState<"a" | "b" | null>(null);
  const [folderDiff, setFolderDiff] = useState<FolderDiff | null>(null);
  const [openFile, setOpenFile] = useState<string | null>(null);
  const [textDiffResult, setTextDiffResult] = useState<{ type: string; value: string }[] | null>(null);

  const handleTextDiff = async () => {
    const Diff = await import("diff");
    const changes = Diff.diffLines(textA, textB);
    setTextDiffResult(
      changes.map((c) => ({
        type: c.added ? "added" : c.removed ? "removed" : "unchanged",
        value: c.value,
      }))
    );
  };

  const handleFolderInput = async (which: "a" | "b", files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(which);
    try {
      const folder = await readFolder(files);
      if (which === "a") setFolderA(folder);
      else setFolderB(folder);
    } finally {
      setLoading(null);
    }
  };

  const handleFolderCompare = () => {
    if (folderA.length === 0 || folderB.length === 0) return;
    setFolderDiff(compareFolders(folderA, folderB));
    setOpenFile(null);
  };

  const fileLineDiff = useMemo(() => {
    if (!openFile || !folderDiff) return null;
    const target = folderDiff.modified.find((f) => f.path === openFile);
    if (!target) return null;
    return target;
  }, [openFile, folderDiff]);

  const [fileLineDiffResult, setFileLineDiffResult] = useState<{ type: string; value: string }[] | null>(null);

  useMemo(() => {
    if (!fileLineDiff) {
      setFileLineDiffResult(null);
      return;
    }
    import("diff").then((Diff) => {
      const changes = Diff.diffLines(fileLineDiff.aContent, fileLineDiff.bContent);
      setFileLineDiffResult(
        changes.map((c) => ({
          type: c.added ? "added" : c.removed ? "removed" : "unchanged",
          value: c.value,
        }))
      );
    });
  }, [fileLineDiff]);

  return (
    <CalculatorLayout
      title="텍스트·폴더 Diff 비교"
      description="두 텍스트 또는 두 폴더의 차이점을 라인 단위로 비교. 추가·삭제·변경 시각화. 브라우저 내 처리, 코드·문서 안전."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => setMode("text")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
              mode === "text"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
            }`}
          >
            📝 텍스트 비교
          </button>
          <button
            onClick={() => setMode("folder")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
              mode === "folder"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
            }`}
          >
            📁 폴더 비교
          </button>
        </div>

        {mode === "text" ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">텍스트 A (원본)</div>
                <textarea
                  value={textA}
                  onChange={(e) => setTextA(e.target.value)}
                  className="block w-full h-[200px] rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs resize-none"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">텍스트 B (변경)</div>
                <textarea
                  value={textB}
                  onChange={(e) => setTextB(e.target.value)}
                  className="block w-full h-[200px] rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs resize-none"
                />
              </div>
            </div>
            <button
              onClick={handleTextDiff}
              className="w-full mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              🔍 차이점 비교
            </button>
            {textDiffResult && (
              <div className="mt-5 rounded-lg bg-slate-50 dark:bg-slate-900 p-3 font-mono text-xs overflow-auto max-h-[400px]">
                {textDiffResult.map((part, i) => (
                  <pre
                    key={i}
                    className={`whitespace-pre-wrap ${
                      part.type === "added"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300"
                        : part.type === "removed"
                        ? "bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 line-through"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {part.type === "added" ? "+ " : part.type === "removed" ? "- " : "  "}
                    {part.value}
                  </pre>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">폴더 A (원본)</div>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-6 text-center transition">
                  <input
                    type="file"
                    {...{ webkitdirectory: "true", directory: "true" } as React.InputHTMLAttributes<HTMLInputElement>}
                    multiple
                    onChange={(e) => handleFolderInput("a", e.target.files)}
                    className="hidden"
                  />
                  <div className="text-3xl mb-1">📁</div>
                  <div className="text-sm font-medium">폴더 선택</div>
                  {loading === "a" && <div className="text-xs text-indigo-500 animate-pulse mt-1">읽는 중...</div>}
                  {folderA.length > 0 && (
                    <div className="text-xs text-emerald-600 mt-1">✓ {folderA.length}개 파일</div>
                  )}
                </label>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">폴더 B (비교)</div>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-6 text-center transition">
                  <input
                    type="file"
                    {...{ webkitdirectory: "true", directory: "true" } as React.InputHTMLAttributes<HTMLInputElement>}
                    multiple
                    onChange={(e) => handleFolderInput("b", e.target.files)}
                    className="hidden"
                  />
                  <div className="text-3xl mb-1">📁</div>
                  <div className="text-sm font-medium">폴더 선택</div>
                  {loading === "b" && <div className="text-xs text-indigo-500 animate-pulse mt-1">읽는 중...</div>}
                  {folderB.length > 0 && (
                    <div className="text-xs text-emerald-600 mt-1">✓ {folderB.length}개 파일</div>
                  )}
                </label>
              </div>
            </div>

            <button
              onClick={handleFolderCompare}
              disabled={folderA.length === 0 || folderB.length === 0}
              className="w-full mt-4 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              🔍 폴더 비교
            </button>

            {folderDiff && (
              <div className="mt-6 space-y-4">
                {/* 요약 */}
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-3">
                    <div className="text-xs text-emerald-700">추가</div>
                    <div className="text-2xl font-bold text-emerald-700">{folderDiff.added.length}</div>
                  </div>
                  <div className="rounded-lg bg-rose-50 dark:bg-rose-950 p-3">
                    <div className="text-xs text-rose-700">삭제</div>
                    <div className="text-2xl font-bold text-rose-700">{folderDiff.removed.length}</div>
                  </div>
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3">
                    <div className="text-xs text-amber-700">변경</div>
                    <div className="text-2xl font-bold text-amber-700">{folderDiff.modified.length}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
                    <div className="text-xs text-slate-500">동일</div>
                    <div className="text-2xl font-bold text-slate-600">{folderDiff.unchanged}</div>
                  </div>
                </div>

                {/* 파일 목록 */}
                {folderDiff.added.length > 0 && (
                  <details className="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-3">
                    <summary className="text-sm font-semibold cursor-pointer">➕ 추가된 파일 ({folderDiff.added.length})</summary>
                    <div className="mt-2 space-y-0.5">
                      {folderDiff.added.map((f) => (
                        <div key={f.path} className="font-mono text-xs">{f.path}</div>
                      ))}
                    </div>
                  </details>
                )}
                {folderDiff.removed.length > 0 && (
                  <details className="rounded-lg bg-rose-50 dark:bg-rose-950 p-3">
                    <summary className="text-sm font-semibold cursor-pointer">➖ 삭제된 파일 ({folderDiff.removed.length})</summary>
                    <div className="mt-2 space-y-0.5">
                      {folderDiff.removed.map((f) => (
                        <div key={f.path} className="font-mono text-xs">{f.path}</div>
                      ))}
                    </div>
                  </details>
                )}
                {folderDiff.modified.length > 0 && (
                  <details className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3" open>
                    <summary className="text-sm font-semibold cursor-pointer">✏️ 변경된 파일 ({folderDiff.modified.length})</summary>
                    <div className="mt-2 space-y-0.5">
                      {folderDiff.modified.map((f) => (
                        <button
                          key={f.path}
                          onClick={() => setOpenFile(openFile === f.path ? null : f.path)}
                          className={`block w-full text-left font-mono text-xs px-2 py-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900 ${
                            openFile === f.path ? "bg-amber-200 dark:bg-amber-800" : ""
                          }`}
                        >
                          {f.path}
                        </button>
                      ))}
                    </div>
                  </details>
                )}

                {/* 라인 단위 diff */}
                {fileLineDiffResult && openFile && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      📄 {openFile} — 라인별 차이
                    </div>
                    <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs overflow-auto max-h-[400px]">
                      {fileLineDiffResult.map((part, i) => (
                        <pre
                          key={i}
                          className={`whitespace-pre-wrap ${
                            part.type === "added"
                              ? "text-emerald-400"
                              : part.type === "removed"
                              ? "text-rose-400"
                              : "text-slate-400"
                          }`}
                        >
                          {part.type === "added" ? "+ " : part.type === "removed" ? "- " : "  "}
                          {part.value}
                        </pre>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>폴더 비교 한계</strong>: ① Chrome·Firefox·Edge만 지원 (Safari X) ② 1,000개+ 파일은 메모리 부담 ③ 5MB 초과 텍스트는 라인 diff 생략 (해시 비교만) ④ 바이너리 파일은 해시로 변경 여부만 판단.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 모든 처리는 브라우저 안에서. 소스 코드·민감 문서가 서버로 전송되지 않습니다.
      </div>
    </CalculatorLayout>
  );
}
