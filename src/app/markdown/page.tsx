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
      const { marked } = await import("marked");
      marked.setOptions({ gfm: true, breaks: true });
      const result = await marked.parse(text);
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
<style>
body { font-family: -apple-system, "Noto Sans KR", sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; line-height: 1.6; color: #1f2937; }
h1, h2, h3 { border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
code { background: #f3f4f6; padding: 0.2em 0.4em; border-radius: 3px; font-family: "JetBrains Mono", monospace; font-size: 0.9em; }
pre { background: #1e293b; color: #e2e8f0; padding: 1em; border-radius: 6px; overflow-x: auto; }
pre code { background: none; color: inherit; padding: 0; }
blockquote { border-left: 4px solid #6366f1; padding-left: 1em; color: #4b5563; margin-left: 0; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; }
th, td { border: 1px solid #e5e7eb; padding: 0.5em; }
th { background: #f9fafb; }
a { color: #4f46e5; }
img { max-width: 100%; }
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

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`markdown-${Date.now()}.pdf`);
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
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x dark:divide-slate-700">
          {/* 입력 */}
          <div className="p-4">
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
              className="block w-full h-[500px] rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 font-mono text-sm resize-none focus:border-indigo-500 focus:outline-none"
              placeholder="여기에 Markdown 입력..."
            />
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {stats.lines} 줄 · {stats.words} 단어 · {stats.chars} 자
            </div>
          </div>

          {/* 출력 */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setTab("preview")}
                  className={`text-xs px-3 py-1.5 rounded ${
                    tab === "preview" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  미리보기
                </button>
                <button
                  onClick={() => setTab("html")}
                  className={`text-xs px-3 py-1.5 rounded ${
                    tab === "html" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  HTML 코드
                </button>
              </div>
              <div className="flex gap-1">
                <button onClick={handleCopyHTML} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100">
                  📋 복사
                </button>
                <button onClick={handleDownloadHTML} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100">
                  💾 HTML
                </button>
                <button onClick={handleDownloadPDF} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-rose-100">
                  📄 PDF
                </button>
              </div>
            </div>
            {tab === "preview" ? (
              <div
                ref={previewRef}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-4 h-[500px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-4 h-[500px] overflow-auto font-mono text-xs whitespace-pre-wrap">
                {html}
              </pre>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 입력 텍스트가 서버로 전송되지 않습니다. GFM (GitHub Flavored Markdown) 표준 지원: 테이블, 체크리스트, 자동 링크, 줄바꿈.
      </div>
    </CalculatorLayout>
  );
}
