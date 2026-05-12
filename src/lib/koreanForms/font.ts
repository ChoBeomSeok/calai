"use client";

import { PDFDocument, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

// 폰트 바이트 캐시 (한 세션에서 여러 양식 만들 때 재요청 방지)
let regularBytes: ArrayBuffer | null = null;
let boldBytes: ArrayBuffer | null = null;

async function loadBytes(path: string): Promise<ArrayBuffer> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`폰트 로드 실패: ${path} (${res.status})`);
  return await res.arrayBuffer();
}

export async function preloadKoreanFonts(): Promise<void> {
  if (!regularBytes) regularBytes = await loadBytes("/fonts/NanumGothic-Regular.ttf");
  if (!boldBytes) boldBytes = await loadBytes("/fonts/NanumGothic-Bold.ttf");
}

export async function embedKoreanFonts(
  pdfDoc: PDFDocument
): Promise<{ regular: PDFFont; bold: PDFFont }> {
  pdfDoc.registerFontkit(fontkit);
  if (!regularBytes) regularBytes = await loadBytes("/fonts/NanumGothic-Regular.ttf");
  if (!boldBytes) boldBytes = await loadBytes("/fonts/NanumGothic-Bold.ttf");
  const regular = await pdfDoc.embedFont(regularBytes);
  const bold = await pdfDoc.embedFont(boldBytes);
  return { regular, bold };
}
