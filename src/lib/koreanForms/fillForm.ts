"use client";

import { PDFDocument, PDFFont, rgb } from "pdf-lib";
import { embedKoreanFonts } from "./font";
import type { FormField, FormTemplate } from "./types";

export type FieldValue = string | boolean;

/**
 * 정부 표준 PDF에 사용자 입력값을 좌표 기반으로 그려서 채워진 PDF를 반환.
 *
 * - 좌표·크기는 FormTemplate.fields 에 정의되어 있어야 함
 * - 한글은 NanumGothic으로 임베드 (정부 PDF의 폰트와 미묘하게 다를 수 있음, 가독성 우선)
 * - text: 한 줄 또는 multiline. width 초과 시 width로 자르고 줄바꿈
 * - checkbox: ✓ 그리기 (값이 true일 때만)
 * - signature: 추후 손글씨 PNG 임베드 가능 (현재는 텍스트 fallback)
 */
export async function fillForm(
  template: FormTemplate,
  values: Record<string, FieldValue>
): Promise<Uint8Array> {
  // 원본 PDF fetch
  const res = await fetch(template.pdfPath);
  if (!res.ok) {
    throw new Error(
      `양식 PDF를 불러오지 못했습니다 (${res.status}): ${template.pdfPath}`
    );
  }
  const original = new Uint8Array(await res.arrayBuffer());

  // PDF 로드 (필요 시 비암호 PDF만 지원)
  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(original);
  } catch (e) {
    throw new Error(
      e instanceof Error ? `양식 PDF 로드 실패: ${e.message}` : "양식 PDF 로드 실패"
    );
  }

  const { regular, bold } = await embedKoreanFonts(pdfDoc);
  const pages = pdfDoc.getPages();

  for (const field of template.fields) {
    const value = values[field.id];
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && !value.trim()) continue;
    if (typeof value === "boolean" && !value) continue;

    const pageIndex = field.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) {
      console.warn(`필드 ${field.id}: 페이지 ${field.page}가 PDF 범위 밖`);
      continue;
    }
    const page = pages[pageIndex];

    if (field.type === "checkbox") {
      drawCheckbox(page, field, bold);
    } else if (field.type === "text" || field.type === "signature") {
      drawTextField(page, field, String(value), regular);
    }
  }

  return await pdfDoc.save();
}

function drawCheckbox(page: ReturnType<PDFDocument["getPages"]>[number], field: FormField, font: PDFFont) {
  const size = field.fontSize ?? Math.max(field.height - 2, 10);
  page.drawText("✓", {
    x: field.x + Math.max(0, (field.width - size * 0.5) / 2),
    y: field.y + Math.max(0, (field.height - size) / 2),
    size,
    font,
    color: rgb(0.05, 0.05, 0.05),
  });
}

function drawTextField(
  page: ReturnType<PDFDocument["getPages"]>[number],
  field: FormField,
  value: string,
  font: PDFFont
) {
  const size = field.fontSize ?? 10;
  const color = rgb(0.05, 0.05, 0.05);
  const text = value;

  if (!field.multiline) {
    // 한 줄: 너비 초과 시 자르기 + 정렬
    const truncated = truncateToWidth(text, font, size, field.width);
    const w = font.widthOfTextAtSize(truncated, size);
    let drawX = field.x;
    if (field.align === "center") drawX = field.x + Math.max(0, (field.width - w) / 2);
    else if (field.align === "right") drawX = field.x + Math.max(0, field.width - w);
    page.drawText(truncated, { x: drawX, y: field.y, size, font, color });
    return;
  }

  // 멀티라인
  const lines = wrapText(text, font, size, field.width);
  const lineHeight = size * 1.35;
  let cursorY = field.y + field.height - size; // 위에서부터 그리기
  for (const line of lines) {
    if (cursorY < field.y) break; // 박스 넘어가면 잘림
    page.drawText(line, { x: field.x, y: cursorY, size, font, color });
    cursorY -= lineHeight;
  }
}

function truncateToWidth(text: string, font: PDFFont, size: number, maxWidth: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let out = "";
  for (const ch of text) {
    const test = out + ch;
    if (font.widthOfTextAtSize(test + "…", size) > maxWidth) break;
    out = test;
  }
  return out + "…";
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const paragraphs = text.split(/\r?\n/);
  const out: string[] = [];
  for (const para of paragraphs) {
    if (para === "") {
      out.push("");
      continue;
    }
    let line = "";
    for (const ch of para) {
      const test = line + ch;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        if (line) out.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}
