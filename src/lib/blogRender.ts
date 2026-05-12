import { marked } from "marked";

export type Heading = { level: 2 | 3; text: string; id: string };

// 본문 markdown에서 H2·H3 헤딩만 추출 (TOC용)
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;
  let counter = 0;
  for (const line of lines) {
    // ``` 코드 블록 안의 ##는 무시
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const m = line.match(/^(##|###)\s+(.+?)\s*$/);
    if (m) {
      counter++;
      const level = (m[1].length === 2 ? 2 : 3) as 2 | 3;
      // 인라인 마크다운 제거 (굵게·강조·링크)
      const text = m[2]
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/`(.+?)`/g, "$1")
        .replace(/\[(.+?)\]\([^)]+\)/g, "$1")
        .trim();
      const id = `h-${counter}`;
      headings.push({ level, text, id });
    }
  }
  return headings;
}

// marked로 markdown → html 변환 후 3가지 후처리
export async function renderPost(
  markdown: string
): Promise<{ html: string; headings: Heading[] }> {
  marked.setOptions({ gfm: true, breaks: true });
  const headings = extractHeadings(markdown);

  let html = (await marked.parse(markdown)) as string;
  html = unwrapSingleTildeDel(html);
  html = addHeadingIds(html, headings);
  html = transformCallouts(html);
  html = highlightNumbers(html);

  return { html, headings };
}

// marked GFM이 단일 ~를 <del>로 잘못 변환한 것을 원래 텍스트로 복원
// 본문에 의도적 취소선(~~text~~)은 안 쓰므로 모든 <del> 풀어줌
function unwrapSingleTildeDel(html: string): string {
  return html.replace(/<del>([\s\S]*?)<\/del>/g, "~$1~");
}

// marked가 만든 <h2>·<h3>에 등장 순서대로 id 부여
function addHeadingIds(html: string, headings: Heading[]): string {
  let i = 0;
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (match, lvl, attrs, text) => {
    if (i >= headings.length) return match;
    const h = headings[i];
    i++;
    // 기존 id가 이미 있으면 유지
    if (attrs.includes("id=")) return match;
    return `<h${lvl}${attrs} id="${h.id}">${text}</h${lvl}>`;
  });
}

// blockquote → 콜아웃 박스 변환
// > 💡 ... → tip / > ⚠️ ... → warn / > 📊 ... → info / > ✅ ... → ok / > 🚨 ... → danger
function transformCallouts(html: string): string {
  const colors: Record<string, string> = {
    tip: "bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-900 dark:text-amber-200",
    warn: "bg-orange-50 dark:bg-orange-950/30 border-orange-400 text-orange-900 dark:text-orange-200",
    info: "bg-sky-50 dark:bg-sky-950/30 border-sky-400 text-sky-900 dark:text-sky-200",
    ok: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-900 dark:text-emerald-200",
    danger: "bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-900 dark:text-rose-200",
  };
  const map: Record<string, string> = {
    "💡": "tip",
    "⚠️": "warn",
    "📊": "info",
    "✅": "ok",
    "🚨": "danger",
  };
  return html.replace(
    /<blockquote>\s*([\s\S]+?)\s*<\/blockquote>/g,
    (match, inner) => {
      // 첫 <p> 안의 첫 이모지로 타입 판정
      const m = inner.match(/^\s*<p[^>]*>\s*(💡|⚠️|📊|✅|🚨)\s*/);
      if (!m) return match;
      const type = map[m[1]];
      const cleaned = inner.replace(/^\s*<p([^>]*)>\s*(💡|⚠️|📊|✅|🚨)\s*/, "<p$1>");
      return `<div class="callout border-l-4 ${colors[type]} px-4 py-3 my-5 rounded-r-lg"><span class="text-lg mr-1 not-prose">${m[1]}</span>${cleaned}</div>`;
    }
  );
}

// 본문 <p>·<li> 안의 핵심 숫자(콤마 포함·단위 결합)만 강조
function highlightNumbers(html: string): string {
  // 강조 후보 단위
  const units = "원|만|억|점|년|개월|일|위|명|시간|분|초|배|%|kg|cm|km|평";
  // 콤마 포함 숫자 (단위 선택)
  const re1 = new RegExp(`(\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?(?:${units})?)`, "g");
  // 2자리 이상 숫자 + 필수 단위
  const re2 = new RegExp(`(\\d{2,}(?:\\.\\d+)?(?:${units}))`, "g");
  // 1자리 숫자 + 큰 단위 (만·억)만
  const re3 = /(\d\.\d+(?:억|만))/g;

  const wrap = (s: string) =>
    `<strong class="text-indigo-700 dark:text-indigo-400 font-semibold">${s}</strong>`;

  // <p>·<li> 안의 텍스트만 처리 (heading·link·code·blockquote 제외)
  return html.replace(
    /(<(?:p|li)[^>]*>)([\s\S]*?)(<\/(?:p|li)>)/g,
    (_, open, content: string, close) => {
      // 태그(<a>, <code>, <strong>) 안은 건드리지 않게 토큰 분리
      const parts = content.split(/(<[^>]+>)/);
      const processed = parts
        .map((p, idx) => {
          if (idx % 2 === 1) return p; // 태그
          return p.replace(re1, wrap).replace(re2, wrap).replace(re3, wrap);
        })
        .join("");
      return open + processed + close;
    }
  );
}
