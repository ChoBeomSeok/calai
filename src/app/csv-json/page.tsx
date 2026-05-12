"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "csv2json" | "json2csv";
type Delim = "auto" | "," | ";" | "\t" | "|";

const SAMPLE_CSV = `name,age,city
김철수,30,서울
이영희,25,부산
박민수,42,대구`;

export default function CsvJsonPage() {
  const [mode, setMode] = useState<Mode>("csv2json");
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [jsonText, setJsonText] = useState("");
  const [header, setHeader] = useState(true);
  const [delimiter, setDelimiter] = useState<Delim>("auto");
  const [dynamicTyping, setDynamicTyping] = useState(true);
  const [pretty, setPretty] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"csv" | "json" | null>(null);

  const inputText = mode === "csv2json" ? csvText : jsonText;
  const outputText = mode === "csv2json" ? jsonText : csvText;

  // 변환 실행
  const runConvert = () => {
    setError("");
    try {
      if (mode === "csv2json") {
        const result = Papa.parse<Record<string, unknown> | unknown[]>(csvText, {
          header,
          skipEmptyLines: "greedy",
          dynamicTyping,
          delimiter: delimiter === "auto" ? "" : delimiter,
        });
        if (result.errors.length > 0) {
          const e = result.errors[0];
          setError(`CSV 파싱 오류 (${e.row}행): ${e.message}`);
        }
        const out = pretty ? JSON.stringify(result.data, null, 2) : JSON.stringify(result.data);
        setJsonText(out);
      } else {
        const parsed = JSON.parse(jsonText);
        if (!Array.isArray(parsed)) {
          setError("JSON은 배열이어야 합니다. 예: [{...}, {...}]");
          return;
        }
        const out = Papa.unparse(parsed, {
          delimiter: delimiter === "auto" ? "," : delimiter,
          header: true,
        });
        setCsvText(out);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleUpload = (f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      if (mode === "csv2json") setCsvText(text);
      else setJsonText(text);
    };
    reader.readAsText(f);
  };

  const handleDownload = () => {
    const isJson = mode === "csv2json";
    const blob = new Blob([outputText], {
      type: isJson ? "application/json" : "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isJson ? "data.json" : "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (which: "csv" | "json") => {
    const text = which === "csv" ? csvText : jsonText;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError("클립보드 복사 실패");
    }
  };

  // 미리보기 테이블 (csv2json일 때 결과 JSON 기반)
  const preview = useMemo(() => {
    try {
      const data = mode === "csv2json" ? JSON.parse(jsonText || "[]") : JSON.parse(jsonText || "[]");
      if (!Array.isArray(data) || data.length === 0) return null;
      const rows = data.slice(0, 5);
      const cols = Array.from(
        new Set(rows.flatMap((r: unknown) => (typeof r === "object" && r !== null ? Object.keys(r) : [])))
      );
      if (cols.length === 0) return null;
      return { cols, rows: rows as Array<Record<string, unknown>> };
    } catch {
      return null;
    }
  }, [jsonText, mode]);

  return (
    <CalculatorLayout
      title="CSV ↔ JSON 변환기"
      description="CSV ↔ JSON 양방향 무료 변환. 헤더 자동 인식·구분자 감지·숫자 자동 타입. 파일 업로드/다운로드, 100% 브라우저 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 모드 토글 */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setMode("csv2json")}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
              mode === "csv2json"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            CSV → JSON
          </button>
          <button
            onClick={() => setMode("json2csv")}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
              mode === "json2csv"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            JSON → CSV
          </button>
        </div>

        {/* 옵션 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
          <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={header}
              onChange={(e) => setHeader(e.target.checked)}
              disabled={mode === "json2csv"}
              className="accent-indigo-600"
            />
            첫 행 헤더
          </label>
          <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={dynamicTyping}
              onChange={(e) => setDynamicTyping(e.target.checked)}
              disabled={mode === "json2csv"}
              className="accent-indigo-600"
            />
            숫자 자동 변환
          </label>
          <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={pretty}
              onChange={(e) => setPretty(e.target.checked)}
              disabled={mode === "json2csv"}
              className="accent-indigo-600"
            />
            JSON 정렬
          </label>
          <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="shrink-0">구분자</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as Delim)}
              className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-xs"
            >
              <option value="auto">자동</option>
              <option value=",">쉼표 ,</option>
              <option value=";">세미콜론 ;</option>
              <option value={"\t"}>탭</option>
              <option value="|">파이프 |</option>
            </select>
          </label>
        </div>

        {/* 입출력 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 입력 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {mode === "csv2json" ? "📥 CSV 입력" : "📥 JSON 입력"}
              </div>
              <label className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer">
                📁 파일
                <input
                  type="file"
                  accept={mode === "csv2json" ? ".csv,.tsv,.txt" : ".json,.txt"}
                  onChange={(e) => handleUpload(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => (mode === "csv2json" ? setCsvText(e.target.value) : setJsonText(e.target.value))}
              rows={14}
              spellCheck={false}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* 출력 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {mode === "csv2json" ? "📤 JSON 출력" : "📤 CSV 출력"}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleCopy(mode === "csv2json" ? "json" : "csv")}
                  disabled={!outputText}
                  className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? "✓ 복사됨" : "📋 복사"}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!outputText}
                  className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-50"
                >
                  💾 다운로드
                </button>
              </div>
            </div>
            <textarea
              value={outputText}
              readOnly
              rows={14}
              spellCheck={false}
              placeholder="변환 버튼을 누르면 여기에 결과가 나타납니다."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* 변환 버튼 */}
        <button
          onClick={runConvert}
          className="mt-5 w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          ⇅ 변환 실행
        </button>

        {error && (
          <div className="mt-3 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* 미리보기 테이블 */}
        {preview && mode === "csv2json" && (
          <div className="mt-5">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              📊 미리보기 (상위 5행)
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    {preview.cols.map((c) => (
                      <th key={c} className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((r, i) => (
                    <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                      {preview.cols.map((c) => (
                        <td key={c} className="px-3 py-2 text-slate-700 dark:text-slate-300 font-mono">
                          {r[c] === null || r[c] === undefined ? "" : String(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 파일이 서버로 전송되지 않습니다. 모든 처리는 브라우저 안에서.
      </div>
    </CalculatorLayout>
  );
}
