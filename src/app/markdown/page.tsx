"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

const SAMPLE = `# 마크다운 미리보기

## 기본 문법

**굵게**, *기울임*, ~~취소선~~, \`인라인 코드\`

### 목록
- 순서 없는 목록
- 항목 2
  - 중첩 항목

1. 순서 있는 목록
2. 두 번째
3. 세 번째

### 링크·이미지
[Google](https://google.com)

### 인용
> 이것은 인용문입니다.
> 여러 줄 가능.

### 코드 블록

\`\`\`javascript
function hello(name) {
  return \`안녕하세요, \${name}님!\`;
}
\`\`\`

### 표 (GFM)

| 헤더1 | 헤더2 | 헤더3 |
|-------|-------|-------|
| A     | B     | C     |
| D     | E     | F     |

### 체크리스트 (GFM)
- [x] 완료된 작업
- [ ] 진행 중인 작업
- [ ] 예정된 작업

---

수평선 위 아래로 텍스트가 분리됩니다.
`;

export default function MarkdownPage() {
  const [text, setText] = useState(SAMPLE);
  const [html, setHtml] = useState("");
  const [tab, setTab] = useState<"preview" | "html">("preview");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const { Marked } = await import("marked");
      const { markedHighlight } = await import("marked-highlight");
      const hljs = (await import("highlight.js")).default;

      const m = new Marked(
        markedHighlight({
          emptyLangClass: "hljs",
          langPrefix: "hljs language-",
          highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, { language }).value;
          },
        })
      );
      m.setOptions({ gfm: true, breaks: true });
      const result = await m.parse(text);
      if (!cancelled) setHtml(typeof result === "string" ? result : "");
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [text]);

  const stats = useMemo(() => {
    const lines = text.split("\n").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    return { lines, words, chars };
  }, [text]);

  const handleDownloadHTML = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>마크다운 변환 결과</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/atom-one-dark.min.css">
<style>
body { font-family: -apple-system, "Noto Sans KR", "Pretendard", sans-serif; max-width: 800px; margin: 2rem auto; padding: 1.5rem; line-height: 1.65; color: #1f2937; }
h1 { font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 1rem; padding-bottom: 0.4em; border-bottom: 1px solid #e5e7eb; }
h2 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.8rem; padding-bottom: 0.3em; border-bottom: 1px solid #e5e7eb; }
h3 { font-size: 1.25rem; font-weight: 700; margin: 1.25rem 0 0.6rem; }
p { margin: 0.8rem 0; }
a { color: #4f46e5; text-decoration: underline; text-underline-offset: 2px; }
strong { font-weight: 700; color: #0f172a; }
ul, ol { margin: 0.8rem 0; padding-left: 2rem; }
li { margin: 0.25rem 0; }
code { background: #f1f5f9; color: #be185d; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.875em; font-family: "JetBrains Mono", "SF Mono", Consolas, monospace; }
pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; }
pre code { background: none; color: inherit; padding: 0; font-size: 0.875em; }
blockquote { border-left: 4px solid #6366f1; padding: 0.4rem 1rem; color: #475569; background: #f8fafc; margin: 1rem 0; border-radius: 0 6px 6px 0; }
table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.9em; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
th, td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
th { background: #f8fafc; font-weight: 600; }
tr:nth-child(even) td { background: #fafbfc; }
hr { border: none; height: 1px; background: #e5e7eb; margin: 2rem 0; }
img { max-width: 100%; height: auto; border-radius: 6px; }
del { color: #9ca3af; }
input[type="checkbox"] { margin-right: 0.4em; }
</style>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `markdown-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 브라우저 인쇄 API로 PDF 저장 — html2canvas의 OKLCH 호환성 문제 회피
  // 한글 폰트·코드 하이라이팅·표 모두 완벽 지원
  const handleDownloadPDF = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>마크다운 문서</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/atom-one-dark.min.css">
<style>
@page { size: A4; margin: 15mm; }
* { box-sizing: border-box; }
body { font-family: -apple-system, "Noto Sans KR", "Pretendard", "Malgun Gothic", sans-serif; line-height: 1.65; color: #1f2937; margin: 0; }
h1 { font-size: 24pt; font-weight: 700; margin: 1.2em 0 0.6em; padding-bottom: 0.3em; border-bottom: 1px solid #e5e7eb; }
h2 { font-size: 18pt; font-weight: 700; margin: 1em 0 0.5em; padding-bottom: 0.2em; border-bottom: 1px solid #e5e7eb; }
h3 { font-size: 14pt; font-weight: 700; margin: 0.8em 0 0.4em; }
h4 { font-size: 12pt; font-weight: 700; margin: 0.6em 0 0.3em; }
p { margin: 0.6em 0; }
a { color: #4f46e5; text-decoration: underline; }
strong { font-weight: 700; color: #0f172a; }
ul, ol { margin: 0.6em 0; padding-left: 2em; }
li { margin: 0.2em 0; }
code { background: #f1f5f9; color: #be185d; padding: 0.1em 0.3em; border-radius: 3px; font-family: "JetBrains Mono", "SF Mono", Consolas, monospace; font-size: 0.9em; }
pre { background: #0f172a; color: #e2e8f0; padding: 0.8em; border-radius: 6px; overflow: visible; margin: 0.8em 0; page-break-inside: avoid; }
pre code { background: none; color: inherit; padding: 0; font-size: 9pt; }
blockquote { border-left: 4px solid #6366f1; padding: 0.3em 1em; color: #475569; background: #f8fafc; margin: 0.8em 0; border-radius: 0 6px 6px 0; }
table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 10pt; page-break-inside: avoid; }
th, td { border: 1px solid #e5e7eb; padding: 0.4em 0.6em; text-align: left; }
th { background: #f8fafc; font-weight: 600; }
tr:nth-child(even) td { background: #fafbfc; }
hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5em 0; }
img { max-width: 100%; height: auto; }
del { color: #9ca3af; }
input[type="checkbox"] { margin-right: 0.4em; }
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  pre, table, blockquote { page-break-inside: avoid; }
  h1, h2, h3 { page-break-after: avoid; }
}
</style>
</head>
<body>
${html}
<script>
  window.onload = function() {
    setTimeout(function() {
      window.print();
      window.onafterprint = function() { window.close(); };
    }, 300);
  };
</script>
</body>
</html>`;
    const win = window.open("", "_blank", "width=900,height=900");
    if (!win) {
      alert("팝업이 차단되었습니다. 브라우저 우상단 팝업 차단 아이콘을 클릭해 허용 후 다시 시도해주세요.");
      return;
    }
    win.document.open();
    win.document.write(fullHtml);
    win.document.close();
  };

  const handleCopyHTML = async () => {
    await navigator.clipboard.writeText(html);
    alert("HTML 코드가 클립보드에 복사되었습니다.");
  };

  return (
    <CalculatorLayout
      title="마크다운 미리보기·변환"
      description="Markdown → HTML 실시간 변환 + GFM (테이블·체크리스트·코드 하이라이팅) 지원 + HTML/PDF 다운로드."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-6">
        {/* 입력 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">📝 Markdown 입력</div>
            <button
              onClick={() => setText("")}
              className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950"
            >
              지우기
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            className="block w-full h-[400px] rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-sm resize-y focus:border-indigo-500 focus:outline-none"
            placeholder="여기에 Markdown 입력..."
          />
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {stats.lines} 줄 · {stats.words} 단어 · {stats.chars} 자
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

        {/* 출력 */}
        <div>
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => setTab("preview")}
                className={`text-xs px-3 py-1.5 rounded ${
                  tab === "preview" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700"
                }`}
              >
                👁️ 미리보기
              </button>
              <button
                onClick={() => setTab("html")}
                className={`text-xs px-3 py-1.5 rounded ${
                  tab === "html" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700"
                }`}
              >
                {"</>"} HTML 코드
              </button>
            </div>
            <div className="flex gap-1">
              <button onClick={handleCopyHTML} className="text-xs px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100">
                📋 복사
              </button>
              <button onClick={handleDownloadHTML} className="text-xs px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100">
                💾 HTML
              </button>
              <button onClick={handleDownloadPDF} className="text-xs px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-rose-100" title="새 창 인쇄 다이얼로그 → 대상에 'PDF로 저장' 선택">
                📄 PDF
              </button>
            </div>
          </div>
          {tab === "preview" ? (
            <div
              ref={previewRef}
              className="markdown-preview rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-6 sm:p-8 min-h-[600px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-4 min-h-[600px] overflow-auto font-mono text-xs whitespace-pre-wrap">
              {html}
            </pre>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 입력 텍스트가 서버로 전송되지 않습니다. GFM (GitHub Flavored Markdown) 표준 지원: 테이블, 체크리스트, 자동 링크, 줄바꿈.
      </div>
    </CalculatorLayout>
  );
}
