"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import CalculatorLayout from "@/components/CalculatorLayout";
import type { editor as MonacoEditor } from "monaco-editor";

type LineChange = {
  originalStartLineNumber: number;
  originalEndLineNumber: number;
  modifiedStartLineNumber: number;
  modifiedEndLineNumber: number;
};

type Mode = "text" | "folder";
type ViewMode = "side-by-side" | "inline";
type Language = "auto" | "javascript" | "typescript" | "python" | "java" | "csharp" | "go" | "rust" | "html" | "css" | "json" | "yaml" | "markdown" | "sql" | "plaintext";

const DiffEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.DiffEditor), {
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">에디터 로딩 중...</div>,
});

type FolderFile = { path: string; content: string; hash: string; size: number };

type FolderDiff = {
  added: FolderFile[];
  removed: FolderFile[];
  modified: { path: string; aContent: string; bContent: string; aSize: number; bSize: number }[];
  unchanged: number;
};

async function fileHash(content: string): Promise<string> {
  const data = new TextEncoder().encode(content);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

const TEXT_EXT = /\.(txt|md|json|js|jsx|ts|tsx|css|scss|html|xml|yml|yaml|csv|log|conf|ini|sh|py|rb|go|rs|java|c|cpp|h|swift|kt|sql|env|gitignore|toml|lock|vue|svelte|php)$/i;

async function readFolder(files: FileList, excludePattern: string): Promise<FolderFile[]> {
  const result: FolderFile[] = [];
  let exclude: RegExp | null = null;
  if (excludePattern.trim()) {
    try {
      exclude = new RegExp(excludePattern);
    } catch {
      exclude = null;
    }
  }
  for (const file of Array.from(files)) {
    const path = (file as File & { webkitRelativePath: string }).webkitRelativePath.split("/").slice(1).join("/");
    if (!path) continue;
    if (exclude && exclude.test(path)) continue;
    const isText = TEXT_EXT.test(path);
    let content = "";
    if (isText && file.size < 5_000_000) {
      try {
        content = await file.text();
      } catch {
        content = "";
      }
    }
    const hash = content ? await fileHash(content) : `binary-${file.size}`;
    result.push({ path, content, hash, size: file.size });
  }
  return result;
}

function compareFolders(a: FolderFile[], b: FolderFile[]): FolderDiff {
  const mapA = new Map(a.map((f) => [f.path, f]));
  const mapB = new Map(b.map((f) => [f.path, f]));
  const added: FolderFile[] = [];
  const removed: FolderFile[] = [];
  const modified: { path: string; aContent: string; bContent: string; aSize: number; bSize: number }[] = [];
  let unchanged = 0;
  for (const [path, fileA] of mapA) {
    const fileB = mapB.get(path);
    if (!fileB) removed.push(fileA);
    else if (fileA.hash !== fileB.hash)
      modified.push({ path, aContent: fileA.content, bContent: fileB.content, aSize: fileA.size, bSize: fileB.size });
    else unchanged++;
  }
  for (const [path, fileB] of mapB) {
    if (!mapA.has(path)) added.push(fileB);
  }
  return {
    added: added.sort((x, y) => x.path.localeCompare(y.path)),
    removed: removed.sort((x, y) => x.path.localeCompare(y.path)),
    modified: modified.sort((x, y) => x.path.localeCompare(y.path)),
    unchanged,
  };
}

function detectLanguage(path: string): string {
  const ext = path.toLowerCase().split(".").pop();
  const map: Record<string, string> = {
    js: "javascript", jsx: "javascript", mjs: "javascript",
    ts: "typescript", tsx: "typescript",
    py: "python", rb: "ruby", java: "java", cs: "csharp", go: "go", rs: "rust",
    c: "c", cpp: "cpp", h: "c", hpp: "cpp",
    html: "html", htm: "html", xml: "xml",
    css: "css", scss: "scss", sass: "scss",
    json: "json", yaml: "yaml", yml: "yaml",
    md: "markdown", sql: "sql", sh: "shell", bash: "shell",
    php: "php", swift: "swift", kt: "kotlin", vue: "html", svelte: "html",
    toml: "ini", conf: "ini", ini: "ini",
  };
  return map[ext || ""] || "plaintext";
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function DiffPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [language, setLanguage] = useState<Language>("plaintext");
  const [textA, setTextA] = useState(`function hello(name) {
  console.log("Hello, " + name);
  return "done";
}`);
  const [textB, setTextB] = useState(`function hello(name, greeting = "Hello") {
  console.log(\`\${greeting}, \${name}\`);
  return { status: "done" };
}`);

  // Monaco DiffEditor 병합 기능
  const textEditorRef = useRef<MonacoEditor.IStandaloneDiffEditor | null>(null);
  const folderEditorRef = useRef<MonacoEditor.IStandaloneDiffEditor | null>(null);
  const [textChanges, setTextChanges] = useState<LineChange[]>([]);
  const [folderChanges, setFolderChanges] = useState<LineChange[]>([]);

  // 폴더 비교
  const [folderA, setFolderA] = useState<FolderFile[]>([]);
  const [folderB, setFolderB] = useState<FolderFile[]>([]);
  const [excludePattern, setExcludePattern] = useState("node_modules|\\.git|dist|build|\\.next");
  const [loading, setLoading] = useState<"a" | "b" | null>(null);
  const [folderDiff, setFolderDiff] = useState<FolderDiff | null>(null);
  const [openFile, setOpenFile] = useState<string | null>(null);

  const handleFolderInput = async (which: "a" | "b", files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(which);
    try {
      const folder = await readFolder(files, excludePattern);
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
    return folderDiff.modified.find((f) => f.path === openFile) || null;
  }, [openFile, folderDiff]);

  const openFileLanguage = useMemo(() => (openFile ? detectLanguage(openFile) : "plaintext"), [openFile]);

  // === Monaco DiffEditor 병합 핸들러 ===
  const onTextEditorMount = useCallback((editor: MonacoEditor.IStandaloneDiffEditor) => {
    textEditorRef.current = editor;
    editor.onDidUpdateDiff(() => {
      const changes = editor.getLineChanges();
      setTextChanges((changes || []) as LineChange[]);
    });
  }, []);

  const onFolderEditorMount = useCallback((editor: MonacoEditor.IStandaloneDiffEditor) => {
    folderEditorRef.current = editor;
    editor.onDidUpdateDiff(() => {
      const changes = editor.getLineChanges();
      setFolderChanges((changes || []) as LineChange[]);
    });
  }, []);

  // 변경 블록 1개를 한쪽으로 적용
  const applyChange = (
    editor: MonacoEditor.IStandaloneDiffEditor | null,
    change: LineChange,
    direction: "a-to-b" | "b-to-a"
  ) => {
    if (!editor) return;
    const originalModel = editor.getOriginalEditor().getModel();
    const modifiedModel = editor.getModifiedEditor().getModel();
    if (!originalModel || !modifiedModel) return;

    if (direction === "a-to-b") {
      // 좌측(A) 내용을 우측(B)에 적용
      const startL = change.originalStartLineNumber;
      const endL = change.originalEndLineNumber || change.originalStartLineNumber;
      const text = startL === 0 ? "" : originalModel.getValueInRange({
        startLineNumber: startL,
        startColumn: 1,
        endLineNumber: endL,
        endColumn: originalModel.getLineMaxColumn(endL),
      });
      const modStart = change.modifiedStartLineNumber;
      const modEnd = change.modifiedEndLineNumber || change.modifiedStartLineNumber;
      const range = modStart === 0
        ? { startLineNumber: modEnd + 1, startColumn: 1, endLineNumber: modEnd + 1, endColumn: 1 }
        : {
            startLineNumber: modStart,
            startColumn: 1,
            endLineNumber: modEnd,
            endColumn: modifiedModel.getLineMaxColumn(modEnd),
          };
      modifiedModel.applyEdits([{ range, text: modStart === 0 ? text + "\n" : text }]);
    } else {
      // 우측(B) 내용을 좌측(A)에 적용
      const startL = change.modifiedStartLineNumber;
      const endL = change.modifiedEndLineNumber || change.modifiedStartLineNumber;
      const text = startL === 0 ? "" : modifiedModel.getValueInRange({
        startLineNumber: startL,
        startColumn: 1,
        endLineNumber: endL,
        endColumn: modifiedModel.getLineMaxColumn(endL),
      });
      const origStart = change.originalStartLineNumber;
      const origEnd = change.originalEndLineNumber || change.originalStartLineNumber;
      const range = origStart === 0
        ? { startLineNumber: origEnd + 1, startColumn: 1, endLineNumber: origEnd + 1, endColumn: 1 }
        : {
            startLineNumber: origStart,
            startColumn: 1,
            endLineNumber: origEnd,
            endColumn: originalModel.getLineMaxColumn(origEnd),
          };
      originalModel.applyEdits([{ range, text: origStart === 0 ? text + "\n" : text }]);
    }
  };

  // 전체 병합 (A → B 또는 B → A)
  const applyAll = (
    editor: MonacoEditor.IStandaloneDiffEditor | null,
    direction: "a-to-b" | "b-to-a"
  ) => {
    if (!editor) return;
    const originalModel = editor.getOriginalEditor().getModel();
    const modifiedModel = editor.getModifiedEditor().getModel();
    if (!originalModel || !modifiedModel) return;
    if (direction === "a-to-b") {
      modifiedModel.setValue(originalModel.getValue());
    } else {
      originalModel.setValue(modifiedModel.getValue());
    }
  };

  // 결과 다운로드
  const downloadResult = (
    editor: MonacoEditor.IStandaloneDiffEditor | null,
    side: "a" | "b",
    filename: string
  ) => {
    if (!editor) return;
    const model = side === "a" ? editor.getOriginalEditor().getModel() : editor.getModifiedEditor().getModel();
    if (!model) return;
    const text = model.getValue();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 다음/이전 변경 점프
  const jumpToChange = (
    editor: MonacoEditor.IStandaloneDiffEditor | null,
    direction: "next" | "prev"
  ) => {
    if (!editor) return;
    if (direction === "next") {
      editor.trigger("source", "editor.action.diffReview.next", null);
    } else {
      editor.trigger("source", "editor.action.diffReview.prev", null);
    }
  };

  return (
    <CalculatorLayout
      title="텍스트·폴더 Diff 비교 (BeyondCompare급)"
      description="두 텍스트 또는 두 폴더 비교. 추가·삭제·변경 라인 자동 색상 표시 (Monaco VS Code 엔진) + 변경 블록별 좌우 병합 + 결과 다운로드."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 모드 선택 */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => setMode("text")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${mode === "text" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
          >
            📝 텍스트 비교
          </button>
          <button
            onClick={() => setMode("folder")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${mode === "folder" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
          >
            📁 폴더 비교
          </button>
        </div>

        {/* 텍스트 모드 */}
        {mode === "text" && (
          <>
            {/* 통합 툴바 */}
            <div className="flex flex-wrap items-center gap-2 mb-3 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              {/* 좌측: 보기 설정 */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs"
              >
                <option value="plaintext">📄 일반</option>
                <option value="javascript">JS</option>
                <option value="typescript">TS</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="markdown">MD</option>
                <option value="sql">SQL</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === "side-by-side" ? "inline" : "side-by-side")}
                className="px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs"
                title="보기 모드 전환"
              >
                {viewMode === "side-by-side" ? "↔" : "↕"}
              </button>
              <button
                onClick={() => {
                  const editor = textEditorRef.current;
                  if (!editor) {
                    const t = textA;
                    setTextA(textB);
                    setTextB(t);
                    return;
                  }
                  const origModel = editor.getOriginalEditor().getModel();
                  const modModel = editor.getModifiedEditor().getModel();
                  if (!origModel || !modModel) return;
                  const a = origModel.getValue();
                  const b = modModel.getValue();
                  setTextA(b);
                  setTextB(a);
                }}
                className="px-2 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs"
                title="A ↔ B 교환"
              >
                🔄
              </button>

              <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />

              {/* 중앙: 점프 + 병합 */}
              <div className="inline-flex rounded border border-slate-300 dark:border-slate-600 overflow-hidden">
                <button
                  onClick={() => jumpToChange(textEditorRef.current, "prev")}
                  className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs"
                  title="이전 변경"
                >
                  ◀
                </button>
                <div className="w-px bg-slate-300 dark:bg-slate-600" />
                <button
                  onClick={() => jumpToChange(textEditorRef.current, "next")}
                  className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs"
                  title="다음 변경"
                >
                  ▶
                </button>
              </div>

              <div className="inline-flex rounded border border-blue-300 overflow-hidden">
                <button
                  onClick={() => applyAll(textEditorRef.current, "a-to-b")}
                  className="px-2.5 py-1.5 bg-blue-500 text-white hover:bg-blue-600 text-xs"
                  title="전체 A → B"
                >
                  ← A 전체
                </button>
                <div className="w-px bg-white" />
                <button
                  onClick={() => applyAll(textEditorRef.current, "b-to-a")}
                  className="px-2.5 py-1.5 bg-blue-500 text-white hover:bg-blue-600 text-xs"
                  title="전체 B → A"
                >
                  B 전체 →
                </button>
              </div>

              <div className="inline-flex rounded border border-emerald-300 overflow-hidden">
                <button
                  onClick={() => downloadResult(textEditorRef.current, "a", `result-A-${Date.now()}.txt`)}
                  className="px-2.5 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 text-xs"
                  title="A 다운로드"
                >
                  💾 A
                </button>
                <div className="w-px bg-white" />
                <button
                  onClick={() => downloadResult(textEditorRef.current, "b", `result-B-${Date.now()}.txt`)}
                  className="px-2.5 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 text-xs"
                  title="B 다운로드"
                >
                  💾 B
                </button>
              </div>

              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                {textChanges.length}개 변경
              </span>
            </div>

            {/* 변경 블록 리스트 (기본 접힘) */}
            {textChanges.length > 0 && (
              <details className="mb-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/30">
                <summary className="text-xs font-medium cursor-pointer text-amber-900 dark:text-amber-300 px-3 py-2 hover:bg-amber-100 dark:hover:bg-amber-900/50">
                  📋 변경 블록별 개별 적용 ({textChanges.length}) — 펼치기
                </summary>
                <div className="px-3 pb-3 space-y-1 max-h-60 overflow-y-auto">
                  {textChanges.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 rounded p-1.5">
                      <span className="font-mono text-slate-500 w-8">#{i + 1}</span>
                      <span className="font-mono text-blue-600 text-xs">
                        A:{c.originalStartLineNumber}-{c.originalEndLineNumber || c.originalStartLineNumber}
                      </span>
                      <span className="text-slate-400">↔</span>
                      <span className="font-mono text-amber-600 text-xs">
                        B:{c.modifiedStartLineNumber}-{c.modifiedEndLineNumber || c.modifiedStartLineNumber}
                      </span>
                      <button
                        onClick={() => applyChange(textEditorRef.current, c, "a-to-b")}
                        className="ml-auto px-2 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
                      >
                        → B
                      </button>
                      <button
                        onClick={() => applyChange(textEditorRef.current, c, "b-to-a")}
                        className="px-2 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
                      >
                        A ←
                      </button>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Monaco Diff Editor */}
            <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600" style={{ height: 500 }}>
              <DiffEditor
                height="500px"
                language={language}
                original={textA}
                modified={textB}
                theme="vs-dark"
                onMount={onTextEditorMount}
                options={{
                  renderSideBySide: viewMode === "side-by-side",
                  readOnly: false,
                  minimap: { enabled: true },
                  fontSize: 13,
                  wordWrap: "on",
                  renderWhitespace: "boundary",
                  diffWordWrap: "on",
                }}
              />
            </div>
          </>
        )}

        {/* 폴더 모드 */}
        {mode === "folder" && (
          <>
            <label className="block mb-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">제외 패턴 (정규식)</span>
              <input
                type="text"
                value={excludePattern}
                onChange={(e) => setExcludePattern(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 font-mono text-xs"
                placeholder="node_modules|\\.git|dist"
              />
              <span className="block mt-1 text-xs text-slate-500">파일 경로에 매칭되면 제외 (기본값: node_modules·.git·dist·build·.next)</span>
            </label>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold mb-2">📁 폴더 A (원본)</div>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-6 text-center">
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
                  {folderA.length > 0 && <div className="text-xs text-emerald-600 mt-1">✓ {folderA.length}개 파일</div>}
                </label>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">📁 폴더 B (비교)</div>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-6 text-center">
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
                  {folderB.length > 0 && <div className="text-xs text-emerald-600 mt-1">✓ {folderB.length}개 파일</div>}
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
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-3">
                    <div className="text-xs text-emerald-700">➕ 추가</div>
                    <div className="text-2xl font-bold text-emerald-700">{folderDiff.added.length}</div>
                  </div>
                  <div className="rounded-lg bg-rose-50 dark:bg-rose-950 p-3">
                    <div className="text-xs text-rose-700">➖ 삭제</div>
                    <div className="text-2xl font-bold text-rose-700">{folderDiff.removed.length}</div>
                  </div>
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3">
                    <div className="text-xs text-amber-700">✏️ 변경</div>
                    <div className="text-2xl font-bold text-amber-700">{folderDiff.modified.length}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
                    <div className="text-xs text-slate-500">✓ 동일</div>
                    <div className="text-2xl font-bold text-slate-600">{folderDiff.unchanged}</div>
                  </div>
                </div>

                {folderDiff.added.length > 0 && (
                  <details className="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-3">
                    <summary className="text-sm font-semibold cursor-pointer">➕ 추가된 파일 ({folderDiff.added.length})</summary>
                    <div className="mt-2 space-y-0.5 max-h-60 overflow-y-auto">
                      {folderDiff.added.map((f) => (
                        <div key={f.path} className="font-mono text-xs flex justify-between">
                          <span>{f.path}</span>
                          <span className="text-slate-500">{fmtSize(f.size)}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                {folderDiff.removed.length > 0 && (
                  <details className="rounded-lg bg-rose-50 dark:bg-rose-950 p-3">
                    <summary className="text-sm font-semibold cursor-pointer">➖ 삭제된 파일 ({folderDiff.removed.length})</summary>
                    <div className="mt-2 space-y-0.5 max-h-60 overflow-y-auto">
                      {folderDiff.removed.map((f) => (
                        <div key={f.path} className="font-mono text-xs flex justify-between">
                          <span>{f.path}</span>
                          <span className="text-slate-500">{fmtSize(f.size)}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                {folderDiff.modified.length > 0 && (
                  <details className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3" open>
                    <summary className="text-sm font-semibold cursor-pointer">✏️ 변경된 파일 ({folderDiff.modified.length})</summary>
                    <div className="mt-2 space-y-0.5 max-h-60 overflow-y-auto">
                      {folderDiff.modified.map((f) => (
                        <button
                          key={f.path}
                          onClick={() => setOpenFile(openFile === f.path ? null : f.path)}
                          className={`block w-full text-left font-mono text-xs px-2 py-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900 ${openFile === f.path ? "bg-amber-200 dark:bg-amber-800" : ""}`}
                        >
                          <span>{f.path}</span>
                          <span className="text-slate-500 ml-2">
                            {fmtSize(f.aSize)} → {fmtSize(f.bSize)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </details>
                )}

                {fileLineDiff && openFile && (
                  <div>
                    <div className="text-sm font-semibold mb-2">📄 {openFile}</div>

                    {/* 폴더 파일 통합 툴바 */}
                    <div className="flex flex-wrap items-center gap-2 mb-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                      <div className="inline-flex rounded border border-slate-300 dark:border-slate-600 overflow-hidden">
                        <button
                          onClick={() => jumpToChange(folderEditorRef.current, "prev")}
                          className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs"
                          title="이전 변경"
                        >
                          ◀
                        </button>
                        <div className="w-px bg-slate-300 dark:bg-slate-600" />
                        <button
                          onClick={() => jumpToChange(folderEditorRef.current, "next")}
                          className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs"
                          title="다음 변경"
                        >
                          ▶
                        </button>
                      </div>

                      <div className="inline-flex rounded border border-blue-300 overflow-hidden">
                        <button
                          onClick={() => applyAll(folderEditorRef.current, "a-to-b")}
                          className="px-2.5 py-1.5 bg-blue-500 text-white hover:bg-blue-600 text-xs"
                          title="전체 A → B"
                        >
                          ← A 전체
                        </button>
                        <div className="w-px bg-white" />
                        <button
                          onClick={() => applyAll(folderEditorRef.current, "b-to-a")}
                          className="px-2.5 py-1.5 bg-blue-500 text-white hover:bg-blue-600 text-xs"
                          title="전체 B → A"
                        >
                          B 전체 →
                        </button>
                      </div>

                      <div className="inline-flex rounded border border-emerald-300 overflow-hidden">
                        <button
                          onClick={() => downloadResult(folderEditorRef.current, "a", `${openFile.split("/").pop()}_A`)}
                          className="px-2.5 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 text-xs"
                          title="A 다운로드"
                        >
                          💾 A
                        </button>
                        <div className="w-px bg-white" />
                        <button
                          onClick={() => downloadResult(folderEditorRef.current, "b", `${openFile.split("/").pop()}_B`)}
                          className="px-2.5 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 text-xs"
                          title="B 다운로드"
                        >
                          💾 B
                        </button>
                      </div>

                      <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                        {folderChanges.length}개 변경
                      </span>
                    </div>

                    {/* 폴더 파일 변경 블록 리스트 (기본 접힘) */}
                    {folderChanges.length > 0 && (
                      <details className="mb-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/30">
                        <summary className="text-xs font-medium cursor-pointer text-amber-900 dark:text-amber-300 px-3 py-2 hover:bg-amber-100 dark:hover:bg-amber-900/50">
                          📋 변경 블록별 개별 적용 ({folderChanges.length}) — 펼치기
                        </summary>
                        <div className="px-3 pb-3 space-y-1 max-h-60 overflow-y-auto">
                          {folderChanges.map((c, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 rounded p-1.5">
                              <span className="font-mono text-slate-500 w-8">#{i + 1}</span>
                              <span className="font-mono text-blue-600 text-xs">
                                A:{c.originalStartLineNumber}-{c.originalEndLineNumber || c.originalStartLineNumber}
                              </span>
                              <span className="text-slate-400">↔</span>
                              <span className="font-mono text-amber-600 text-xs">
                                B:{c.modifiedStartLineNumber}-{c.modifiedEndLineNumber || c.modifiedStartLineNumber}
                              </span>
                              <button
                                onClick={() => applyChange(folderEditorRef.current, c, "a-to-b")}
                                className="ml-auto px-2 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
                              >
                                → B
                              </button>
                              <button
                                onClick={() => applyChange(folderEditorRef.current, c, "b-to-a")}
                                className="px-2 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
                              >
                                A ←
                              </button>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600" style={{ height: 500 }}>
                      <DiffEditor
                        height="500px"
                        language={openFileLanguage}
                        original={fileLineDiff.aContent}
                        modified={fileLineDiff.bContent}
                        theme="vs-dark"
                        onMount={onFolderEditorMount}
                        options={{ renderSideBySide: true, readOnly: false, minimap: { enabled: true }, fontSize: 13 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>BeyondCompare급 기능</strong>: Monaco Diff Editor (VS Code 엔진) + 60개+ 언어 syntax highlighting + 추가(녹색)/삭제(빨강)/변경(황) 라인색 + 미니맵 + 좌우/인라인 전환 + 변경 블록별 병합 + 결과 다운로드.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 모든 처리 브라우저 내 (소스코드·민감 파일 안전).
      </div>
    </CalculatorLayout>
  );
}
