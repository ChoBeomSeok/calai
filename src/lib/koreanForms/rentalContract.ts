"use client";

import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import { embedKoreanFonts } from "./font";

// ─────────────────────────────────────────────────────────────
// 데이터 타입
// ─────────────────────────────────────────────────────────────
export type RentalContractData = {
  // 임대인
  landlordName: string;
  landlordIdLast4: string;
  landlordAddress: string;
  landlordPhone: string;
  // 임차인
  tenantName: string;
  tenantIdLast4: string;
  tenantAddress: string;
  tenantPhone: string;
  // 임대 목적물
  propertyAddress: string;
  propertyArea: string;
  propertyDescription: string;
  // 계약 조건 (금액은 사용자 입력 그대로. 단위는 "원" 또는 한글금액)
  deposit: string;
  monthlyRent: string;
  monthlyDueDay: string; // 매월 N일
  downPayment: string;
  balance: string;
  balanceDate: string;
  startDate: string;
  endDate: string;
  // 특약사항 (줄바꿈 포함 자유 입력)
  specialTerms: string;
  // 계약일
  contractDate: string;
};

// ─────────────────────────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────────────────────────
const A4: [number, number] = [595.28, 841.89];

function drawText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  y: number,
  size: number,
  color = rgb(0.1, 0.1, 0.1)
) {
  page.drawText(text || "", { x, y, size, font, color });
}

function drawCentered(
  page: PDFPage,
  font: PDFFont,
  text: string,
  y: number,
  size: number,
  pageWidth = A4[0],
  color = rgb(0.1, 0.1, 0.1)
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (pageWidth - w) / 2, y, size, font, color });
}

function drawLine(page: PDFPage, x1: number, y: number, x2: number, color = rgb(0.7, 0.7, 0.7)) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness: 0.5, color });
}

// 라벨 + 값 ("라벨: 값")
function drawLabelValue(
  page: PDFPage,
  fontRegular: PDFFont,
  fontBold: PDFFont,
  label: string,
  value: string,
  x: number,
  y: number,
  size: number,
  labelWidth = 60
) {
  page.drawText(label, { x, y, size, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(value || "—", {
    x: x + labelWidth,
    y,
    size,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });
}

// 텍스트를 너비 단위로 줄바꿈 (단어 단위 + 한글 글자 단위 모두 처리)
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (!text) return [""];
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

// ─────────────────────────────────────────────────────────────
// 임대차계약서 PDF 생성
// ─────────────────────────────────────────────────────────────
export async function generateRentalContract(data: RentalContractData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const { regular, bold } = await embedKoreanFonts(pdfDoc);

  // 메타데이터 비우기 (작성자 정보 노출 X)
  pdfDoc.setTitle("주택임대차계약서");
  pdfDoc.setAuthor("");
  pdfDoc.setProducer("calai.kr");
  pdfDoc.setCreator("calai.kr");

  let page = pdfDoc.addPage(A4);
  const xLeft = 50;
  const xRight = A4[0] - 50;
  const contentWidth = xRight - xLeft;
  let y = A4[1] - 60;

  const newPageIfNeeded = (needed: number) => {
    if (y - needed < 60) {
      page = pdfDoc.addPage(A4);
      y = A4[1] - 60;
    }
  };

  // 제목
  drawCentered(page, bold, "주택임대차계약서", y, 20);
  y -= 30;
  drawCentered(
    page,
    regular,
    "임대인과 임차인은 아래와 같이 임대차계약을 체결한다.",
    y,
    10,
    A4[0],
    rgb(0.3, 0.3, 0.3)
  );
  y -= 28;

  // 구분선
  drawLine(page, xLeft, y, xRight, rgb(0.4, 0.4, 0.4));
  y -= 18;

  // ── 제1조 임대차 목적물 ──
  drawText(page, bold, "제1조 (임대차 목적물)", xLeft, y, 12);
  y -= 18;
  drawLabelValue(page, regular, bold, "소재지", data.propertyAddress, xLeft + 12, y, 10, 50);
  y -= 16;
  drawLabelValue(page, regular, bold, "면적", data.propertyArea, xLeft + 12, y, 10, 50);
  y -= 16;
  drawLabelValue(page, regular, bold, "구조·용도", data.propertyDescription, xLeft + 12, y, 10, 60);
  y -= 24;

  // ── 제2조 계약 내용 ──
  drawText(page, bold, "제2조 (계약 내용)", xLeft, y, 12);
  y -= 18;
  drawLabelValue(page, regular, bold, "보증금", `금 ${data.deposit} 원정`, xLeft + 12, y, 10, 60);
  y -= 16;
  const hasMonthlyRent = data.monthlyRent && data.monthlyRent.trim() !== "0" && data.monthlyRent.trim() !== "";
  if (hasMonthlyRent) {
    const monthlyText = data.monthlyDueDay
      ? `금 ${data.monthlyRent} 원정 (매월 ${data.monthlyDueDay}일 지급)`
      : `금 ${data.monthlyRent} 원정 (매월 지급)`;
    drawLabelValue(page, regular, bold, "차임(월세)", monthlyText, xLeft + 12, y, 10, 60);
    y -= 16;
  }
  if (data.downPayment && data.downPayment.trim()) {
    drawLabelValue(
      page,
      regular,
      bold,
      "계약금",
      `금 ${data.downPayment} 원정 (계약 시 지급)`,
      xLeft + 12,
      y,
      10,
      60
    );
    y -= 16;
  }
  if (data.balance && data.balance.trim()) {
    const balanceText = data.balanceDate
      ? `금 ${data.balance} 원정 (${data.balanceDate} 지급)`
      : `금 ${data.balance} 원정`;
    drawLabelValue(page, regular, bold, "잔금", balanceText, xLeft + 12, y, 10, 60);
    y -= 16;
  }
  y -= 8;

  // ── 제3조 임대차 기간 ──
  drawText(page, bold, "제3조 (임대차 기간)", xLeft, y, 12);
  y -= 18;
  drawText(
    page,
    regular,
    `${data.startDate || "____"} 부터 ${data.endDate || "____"} 까지`,
    xLeft + 12,
    y,
    10
  );
  y -= 24;

  // ── 제4조 특약사항 ──
  drawText(page, bold, "제4조 (특약사항)", xLeft, y, 12);
  y -= 16;
  if (data.specialTerms && data.specialTerms.trim()) {
    const lines = wrapText(data.specialTerms, regular, 10, contentWidth - 24);
    for (const line of lines) {
      newPageIfNeeded(16);
      drawText(page, regular, line || " ", xLeft + 12, y, 10);
      y -= 14;
    }
  } else {
    drawText(page, regular, "(없음)", xLeft + 12, y, 10, rgb(0.5, 0.5, 0.5));
    y -= 14;
  }
  y -= 14;

  // ── 마무리 문구 ──
  newPageIfNeeded(120);
  drawText(
    page,
    regular,
    "본 계약을 증명하기 위하여 계약 당사자가 이의 없음을 확인하고",
    xLeft,
    y,
    10
  );
  y -= 14;
  drawText(
    page,
    regular,
    "각각 서명·날인 후 임대인, 임차인이 각각 1통씩 보관한다.",
    xLeft,
    y,
    10
  );
  y -= 22;
  drawText(page, bold, `계약일자: ${data.contractDate || "____년 __월 __일"}`, xLeft, y, 11);
  y -= 28;

  // ── 임대인 ──
  newPageIfNeeded(110);
  drawText(page, bold, "임대인", xLeft, y, 12);
  y -= 16;
  drawLabelValue(
    page,
    regular,
    bold,
    "성명",
    `${data.landlordName || "____"}                                          (인)`,
    xLeft + 12,
    y,
    10,
    40
  );
  y -= 14;
  drawLabelValue(
    page,
    regular,
    bold,
    "주민번호",
    data.landlordIdLast4 ? `******-${data.landlordIdLast4}******` : "",
    xLeft + 12,
    y,
    10,
    60
  );
  y -= 14;
  drawLabelValue(page, regular, bold, "주소", data.landlordAddress, xLeft + 12, y, 10, 40);
  y -= 14;
  drawLabelValue(page, regular, bold, "전화", data.landlordPhone, xLeft + 12, y, 10, 40);
  y -= 22;

  // ── 임차인 ──
  newPageIfNeeded(110);
  drawText(page, bold, "임차인", xLeft, y, 12);
  y -= 16;
  drawLabelValue(
    page,
    regular,
    bold,
    "성명",
    `${data.tenantName || "____"}                                          (인)`,
    xLeft + 12,
    y,
    10,
    40
  );
  y -= 14;
  drawLabelValue(
    page,
    regular,
    bold,
    "주민번호",
    data.tenantIdLast4 ? `******-${data.tenantIdLast4}******` : "",
    xLeft + 12,
    y,
    10,
    60
  );
  y -= 14;
  drawLabelValue(page, regular, bold, "주소", data.tenantAddress, xLeft + 12, y, 10, 40);
  y -= 14;
  drawLabelValue(page, regular, bold, "전화", data.tenantPhone, xLeft + 12, y, 10, 40);

  // 푸터
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const p = pdfDoc.getPage(i);
    p.drawText(`calai.kr 생성 · 본 문서는 참고용이며 법적 효력은 당사자 서명·날인으로 발생합니다.`, {
      x: 50,
      y: 30,
      size: 7,
      font: regular,
      color: rgb(0.6, 0.6, 0.6),
    });
    p.drawText(`${i + 1} / ${pageCount}`, {
      x: A4[0] - 60,
      y: 30,
      size: 8,
      font: regular,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  return await pdfDoc.save();
}
