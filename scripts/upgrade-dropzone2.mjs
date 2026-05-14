#!/usr/bin/env node
// 1차 스크립트가 conditional 구조를 못 잡은 파일들 보정.
// - text-4xl mb-2 → text-5xl sm:text-6xl mb-4
// - 두 번째 hint 줄 indent 10 → 14 보정

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APP = join(ROOT, "src", "app");

const TARGETS = [
  "pdf-extract",
  "pdf-rotate",
  "pdf-split",
  "pdf-to-image",
  "pdf-watermark",
];

let total = 0;
for (const slug of TARGETS) {
  const file = join(APP, slug, "page.tsx");
  let src = readFileSync(file, "utf-8");
  const before = src;

  // 1) 드롭존 아이콘만 키움 (label 안쪽의 text-4xl만)
  //    pdf-sign의 warning/loading 아이콘은 들여쓰기 16칸이므로 매칭 안 됨
  src = src.replace(
    /^( {10}<div className=")text-4xl mb-2(">[^<]+<\/div>)$/gm,
    "$1text-5xl sm:text-6xl mb-4$2",
  );

  // 2) 1차 스크립트가 망친 indent 보정 (10칸 → 14칸)
  src = src.replace(
    /^( {10})(<div className="text-xs sm:text-sm text-slate-500)/gm,
    "              $2",
  );

  // 3) 파일 선택 후 표시되는 파일명도 큰 라벨로
  src = src.replace(
    /font-semibold text-slate-700 dark:text-slate-200">\{file\.name\}/g,
    'font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">{file.name}',
  );

  if (src !== before) {
    writeFileSync(file, src, "utf-8");
    console.log(`✓ ${slug}`);
    total++;
  } else {
    console.log(`- ${slug} (변경 없음)`);
  }
}

console.log(`\n총 ${total}개 파일 정리`);
