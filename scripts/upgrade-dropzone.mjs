#!/usr/bin/env node
// Smallpdf 스타일로 드롭존 시각 강화 — padding·아이콘·라벨 크기 키움.
// 대상: p-8 + text-4xl 패턴을 쓰는 9개 PDF/이미지 도구.
// 이미 p-12 이상인 도구(id-photo, hash, pdf-sign, pdf-password, pdf-batch,
// strip-metadata, remove-background)는 손대지 않음.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APP = join(ROOT, "src", "app");

const TARGETS = [
  "pdf-merge",
  "pdf-split",
  "pdf-compress",
  "pdf-extract",
  "pdf-rotate",
  "pdf-to-image",
  "image-to-pdf",
  "pdf-watermark",
  "image-compress",
];

let total = 0;
for (const slug of TARGETS) {
  const file = join(APP, slug, "page.tsx");
  let src = readFileSync(file, "utf-8");
  const before = src;

  // 1) padding: p-8 → p-12 sm:p-16 (드롭존 라벨만)
  src = src.replace(
    /(border-dashed )p-8( text-center transition)/g,
    "$1p-12 sm:p-16$2",
  );

  // 2) 아이콘: text-4xl mb-2 → text-5xl sm:text-6xl mb-4 (드롭존 안 아이콘만)
  src = src.replace(
    /(<div className=")text-4xl mb-2(">[^<]+<\/div>\s+<div className="font-semibold)/g,
    '$1text-5xl sm:text-6xl mb-4$2',
  );

  // 3) 라벨: font-semibold text-slate-700 → font-semibold text-lg sm:text-xl text-slate-800
  src = src.replace(
    /font-semibold text-slate-700 dark:text-slate-200">([^<]+드래그[^<]+)<\/div>\s+<div className="text-xs text-slate-500/g,
    'font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">$1</div>\n          <div className="text-xs sm:text-sm text-slate-500',
  );

  // 4) 힌트 줄 위 여백 키움
  src = src.replace(
    /text-xs text-slate-500 dark:text-slate-400 mt-1"/g,
    'text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2"',
  );

  if (src !== before) {
    writeFileSync(file, src, "utf-8");
    console.log(`✓ ${slug}`);
    total++;
  } else {
    console.log(`- ${slug} (변경 없음)`);
  }
}

console.log(`\n총 ${total}개 파일 갱신`);
