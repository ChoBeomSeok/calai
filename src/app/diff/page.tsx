"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "text" | "folder" | "image" | "json";
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

  // 폴더 비교
  const [folderA, setFolderA] = useState<FolderFile[]>([]);
  const [folderB, setFolderB] = useState<FolderFile[]>([]);
  const [excludePattern, setExcludePattern] = useState("node_modules|\\.git|dist|build|\\.next");
  const [loading, setLoading] = useState<"a" | "b" | null>(null);
  const [folderDiff, setFolderDiff] = useState<FolderDiff | null>(null);
  const [openFile, setOpenFile] = useState<string | null>(null);

  // 이미지 비교
  const [imgA, setImgA] = useState<string | null>(null);
  const [imgB, setImgB] = useState<string | null>(null);
  const [imgViewMode, setImgViewMode] = useState<"side" | "overlay" | "diff">("side");
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const imgCanvasRef = useRef<HTMLCanvasElement>(null);

  // JSON 비교
  const [jsonA, setJsonA] = useState('{"name":"alice","age":30,"city":"Seoul"}');
  const [jsonB, setJsonB] = useState('{"name":"alice","age":31,"city":"Busan","email":"a@b.com"}');
  const [jsonResult, setJsonResult] = useState<{ left: string; right: string } | null>(null);
  const [jsonError, setJsonError] = useState("");

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

  // 이미지 픽셀 diff
  useEffect(() => {
    if (mode !== "image" || imgViewMode !== "diff" || !imgA || !imgB || !imgCanvasRef.current) return;
    const canvas = imgCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const a = new Image();
    const b = new Image();
    a.crossOrigin = "anonymous";
    b.crossOrigin = "anonymous";
    let loaded = 0;
    const tryRender = () => {
      if (++loaded < 2) return;
      const w = Math.max(a.width, b.width);
      const h = Math.max(a.height, b.height);
      canvas.width = w;
      canvas.height = h;
      const tmpA = document.createElement("canvas");
      tmpA.width = w;
      tmpA.height = h;
      tmpA.getContext("2d")!.drawImage(a, 0, 0, w, h);
      const tmpB = document.createElement("canvas");
      tmpB.width = w;
      tmpB.height = h;
      tmpB.getContext("2d")!.drawImage(b, 0, 0, w, h);
      const dataA = tmpA.getContext("2d")!.getImageData(0, 0, w, h);
      const dataB = tmpB.getContext("2d")!.getImageData(0, 0, w, h);
      const out = ctx.createImageData(w, h);
      let diffCount = 0;
      for (let i = 0; i < dataA.data.length; i += 4) {
        const dr = Math.abs(dataA.data[i] - dataB.data[i]);
        const dg = Math.abs(dataA.data[i + 1] - dataB.data[i + 1]);
        const db = Math.abs(dataA.data[i + 2] - dataB.data[i + 2]);
        const diff = dr + dg + db;
        if (diff > 30) {
          out.data[i] = 255;
          out.data[i + 1] = 50;
          out.data[i + 2] = 50;
          out.data[i + 3] = 255;
          diffCount++;
        } else {
          out.data[i] = (dataA.data[i] + dataB.data[i]) / 2;
          out.data[i + 1] = (dataA.data[i + 1] + dataB.data[i + 1]) / 2;
          out.data[i + 2] = (dataA.data[i + 2] + dataB.data[i + 2]) / 2;
          out.data[i + 3] = 100;
        }
      }
      ctx.putImageData(out, 0, 0);
      console.log(`픽셀 차이: ${diffCount} / ${dataA.data.length / 4}`);
    };
    a.onload = tryRender;
    b.onload = tryRender;
    a.src = imgA;
    b.src = imgB;
  }, [mode, imgViewMode, imgA, imgB]);

  const handleImgFile = (which: "a" | "b", file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (which === "a") setImgA(url);
    else setImgB(url);
  };

  const handleJsonDiff = () => {
    try {
      const a = JSON.parse(jsonA);
      const b = JSON.parse(jsonB);
      const left = JSON.stringify(a, Object.keys(a).sort(), 2);
      const right = JSON.stringify(b, Object.keys(b).sort(), 2);
      setJsonResult({ left, right });
      setJsonError("");
    } catch (e) {
      setJsonError(`JSON 파싱 실패: ${(e as Error).message}`);
      setJsonResult(null);
    }
  };

  return (
    <CalculatorLayout
      title="Diff 비교 (BeyondCompare급)"
      description="텍스트·폴더·이미지·JSON 4가지 모드 비교. Monaco Diff Editor (VS Code 엔진) + 60개+ 언어 syntax highlighting + 픽셀 차이 시각화."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 모드 선택 */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          <button
            onClick={() => setMode("text")}
            className={`px-2 py-2.5 rounded-lg text-sm font-medium border transition ${mode === "text" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
          >
            📝 텍스트
          </button>
          <button
            onClick={() => setMode("folder")}
            className={`px-2 py-2.5 rounded-lg text-sm font-medium border transition ${mode === "folder" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
          >
            📁 폴더
          </button>
          <button
            onClick={() => setMode("image")}
            className={`px-2 py-2.5 rounded-lg text-sm font-medium border transition ${mode === "image" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
          >
            🖼️ 이미지
          </button>
          <button
            onClick={() => setMode("json")}
            className={`px-2 py-2.5 rounded-lg text-sm font-medium border transition ${mode === "json" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
          >
            📊 JSON
          </button>
        </div>

        {/* 텍스트 모드 */}
        {mode === "text" && (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="plaintext">일반 텍스트</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="markdown">Markdown</option>
                <option value="sql">SQL</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === "side-by-side" ? "inline" : "side-by-side")}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
              >
                {viewMode === "side-by-side" ? "↔ 좌우 분할" : "↕ 인라인"}
              </button>
              <button
                onClick={() => { const t = textA; setTextA(textB); setTextB(t); }}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm hover:bg-amber-50"
              >
                🔄 A↔B 교환
              </button>
            </div>

            {/* 입력 텍스트 영역 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
              <textarea
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                placeholder="텍스트 A (원본)"
                className="block w-full h-32 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs"
              />
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                placeholder="텍스트 B (변경)"
                className="block w-full h-32 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs"
              />
            </div>

            {/* Monaco Diff Editor */}
            <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600" style={{ height: 500 }}>
              <DiffEditor
                height="500px"
                language={language}
                original={textA}
                modified={textB}
                theme="vs-dark"
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
                    <div className="text-sm font-semibold mb-2">📄 {openFile} — Monaco Diff Editor</div>
                    <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600" style={{ height: 500 }}>
                      <DiffEditor
                        height="500px"
                        language={openFileLanguage}
                        original={fileLineDiff.aContent}
                        modified={fileLineDiff.bContent}
                        theme="vs-dark"
                        options={{ renderSideBySide: true, readOnly: true, minimap: { enabled: true }, fontSize: 13 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 이미지 모드 */}
        {mode === "image" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold mb-2">🖼️ 이미지 A</div>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-6 text-center">
                  <input type="file" accept="image/*" onChange={(e) => handleImgFile("a", e.target.files?.[0] || null)} className="hidden" />
                  {imgA ? (
                    <img src={imgA} alt="A" className="max-h-40 mx-auto" />
                  ) : (
                    <>
                      <div className="text-3xl mb-1">🖼️</div>
                      <div className="text-sm">이미지 A 선택</div>
                    </>
                  )}
                </label>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">🖼️ 이미지 B</div>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 p-6 text-center">
                  <input type="file" accept="image/*" onChange={(e) => handleImgFile("b", e.target.files?.[0] || null)} className="hidden" />
                  {imgB ? (
                    <img src={imgB} alt="B" className="max-h-40 mx-auto" />
                  ) : (
                    <>
                      <div className="text-3xl mb-1">🖼️</div>
                      <div className="text-sm">이미지 B 선택</div>
                    </>
                  )}
                </label>
              </div>
            </div>

            {imgA && imgB && (
              <>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {([
                    { v: "side", l: "↔ 좌우 비교" },
                    { v: "overlay", l: "◐ 겹쳐 보기" },
                    { v: "diff", l: "🎯 픽셀 차이" },
                  ] as const).map((m) => (
                    <button
                      key={m.v}
                      onClick={() => setImgViewMode(m.v)}
                      className={`px-3 py-2.5 rounded-lg text-sm border transition ${imgViewMode === m.v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
                    >
                      {m.l}
                    </button>
                  ))}
                </div>

                {imgViewMode === "side" && (
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-100 dark:bg-slate-900 p-4">
                    <img src={imgA} alt="A" className="w-full h-auto rounded" />
                    <img src={imgB} alt="B" className="w-full h-auto rounded" />
                  </div>
                )}

                {imgViewMode === "overlay" && (
                  <div className="mt-4">
                    <label className="block mb-2">
                      <span className="text-xs text-slate-600">B 투명도: {(overlayOpacity * 100).toFixed(0)}%</span>
                      <input type="range" min="0" max="100" value={overlayOpacity * 100} onChange={(e) => setOverlayOpacity(parseInt(e.target.value) / 100)} className="w-full" />
                    </label>
                    <div className="relative rounded-lg bg-slate-100 dark:bg-slate-900 p-4 flex justify-center">
                      <div className="relative">
                        <img src={imgA} alt="A" className="max-h-[500px]" />
                        <img src={imgB} alt="B" className="absolute top-0 left-0 max-h-[500px]" style={{ opacity: overlayOpacity }} />
                      </div>
                    </div>
                  </div>
                )}

                {imgViewMode === "diff" && (
                  <div className="mt-4 rounded-lg bg-slate-100 dark:bg-slate-900 p-4 flex justify-center">
                    <canvas ref={imgCanvasRef} className="max-w-full max-h-[500px]" />
                    <div className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
                      🔴 빨강 = 차이 / ⚪ 회색 = 동일
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* JSON 모드 */}
        {mode === "json" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
              <textarea
                value={jsonA}
                onChange={(e) => setJsonA(e.target.value)}
                placeholder='{"name": "A"}'
                className="block w-full h-32 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs"
              />
              <textarea
                value={jsonB}
                onChange={(e) => setJsonB(e.target.value)}
                placeholder='{"name": "B"}'
                className="block w-full h-32 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs"
              />
            </div>
            <button onClick={handleJsonDiff} className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700">
              🔍 JSON 비교 (정렬·들여쓰기 후 diff)
            </button>
            {jsonError && (
              <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 p-3 text-sm text-rose-700">{jsonError}</div>
            )}
            {jsonResult && (
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600" style={{ height: 500 }}>
                <DiffEditor
                  height="500px"
                  language="json"
                  original={jsonResult.left}
                  modified={jsonResult.right}
                  theme="vs-dark"
                  options={{ renderSideBySide: true, readOnly: true, minimap: { enabled: true } }}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-300">
        💡 <strong>BeyondCompare급 기능</strong>: Monaco Diff Editor (VS Code 엔진) + 60개+ 언어 syntax highlighting + 미니맵 + 사이드바이사이드/인라인 전환 + 이미지 픽셀 비교 + JSON 정렬 후 diff.
      </div>
      <div className="mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 모든 처리 브라우저 내 (소스코드·민감 파일 안전).
      </div>
    </CalculatorLayout>
  );
}
