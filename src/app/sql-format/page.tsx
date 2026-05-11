"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Dialect = "sql" | "mysql" | "postgresql" | "mariadb" | "sqlite" | "bigquery" | "redshift" | "transactsql";

const DIALECTS: { v: Dialect; l: string }[] = [
  { v: "sql", l: "Standard SQL" },
  { v: "mysql", l: "MySQL" },
  { v: "postgresql", l: "PostgreSQL" },
  { v: "mariadb", l: "MariaDB" },
  { v: "sqlite", l: "SQLite" },
  { v: "bigquery", l: "BigQuery" },
  { v: "redshift", l: "Redshift" },
  { v: "transactsql", l: "SQL Server (T-SQL)" },
];

const SAMPLE = `select u.id, u.name, count(o.id) as order_count, sum(o.total) as total_spent from users u left join orders o on u.id = o.user_id where u.created_at >= '2024-01-01' and o.status in ('paid', 'shipped') group by u.id, u.name having count(o.id) > 5 order by total_spent desc limit 100;`;

export default function SqlFormatPage() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<Dialect>("sql");
  const [tabWidth, setTabWidth] = useState(2);
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = async () => {
    if (!input.trim()) return;
    try {
      const { format } = await import("sql-formatter");
      const result = format(input, {
        language: dialect,
        tabWidth,
        keywordCase,
        linesBetweenQueries: 2,
      });
      setOutput(result);
      setError("");
    } catch (e) {
      setError(`포매팅 실패: ${(e as Error).message}`);
    }
  };

  const handleMinify = async () => {
    if (!input.trim()) return;
    try {
      const { format } = await import("sql-formatter");
      const formatted = format(input, { language: dialect });
      // 한 줄로 압축
      const minified = formatted.replace(/\s+/g, " ").trim();
      setOutput(minified);
      setError("");
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <CalculatorLayout
      title="SQL 포매터"
      description="압축된 SQL 쿼리를 예쁘게 정렬·들여쓰기 + 키워드 대문자 변환. MySQL·PostgreSQL·SQLite·BigQuery 등 8개 dialect 지원."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        {/* 옵션 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">SQL Dialect</span>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as Dialect)}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              {DIALECTS.map((d) => (
                <option key={d.v} value={d.v}>
                  {d.l}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">들여쓰기</span>
            <select
              value={tabWidth}
              onChange={(e) => setTabWidth(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              <option value={2}>2 스페이스</option>
              <option value={4}>4 스페이스</option>
              <option value={8}>8 스페이스</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-slate-600 dark:text-slate-400">키워드</span>
            <select
              value={keywordCase}
              onChange={(e) => setKeywordCase(e.target.value as "upper" | "lower" | "preserve")}
              className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              <option value="upper">대문자 (SELECT)</option>
              <option value="lower">소문자 (select)</option>
              <option value="preserve">유지</option>
            </select>
          </label>
        </div>

        {/* 입력·출력 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">📥 입력 SQL</span>
              <button
                onClick={() => { setInput(""); setOutput(""); }}
                className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-rose-100"
              >
                지우기
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="block w-full h-[400px] rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-xs resize-none"
              placeholder="SQL 쿼리 입력..."
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">📤 결과</span>
              {output && (
                <button onClick={handleCopy} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100">
                  {copied ? "✓ 복사됨" : "📋 복사"}
                </button>
              )}
            </div>
            <pre className="block w-full h-[400px] rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-900 text-emerald-400 px-3 py-2 font-mono text-xs overflow-auto whitespace-pre-wrap">
              {output || "결과가 여기에 표시됩니다."}
            </pre>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleFormat}
            className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            ✨ 포매팅
          </button>
          <button
            onClick={handleMinify}
            className="flex-1 bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-slate-700"
          >
            🗜️ 한 줄 압축
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 쿼리가 서버로 전송되지 않습니다. 민감한 비즈니스 SQL·DB 스키마 안전.
      </div>
    </CalculatorLayout>
  );
}
