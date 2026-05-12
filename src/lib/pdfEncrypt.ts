"use client";

// PDF 잠금 wrapper — pdf-lib-plus-encrypt 기반
// pthread/SharedArrayBuffer 미사용. 100% 메인 스레드 동작.
// 표준 PDF 암호화 (AES-128 / AES-256). Adobe·Chrome·Preview 모두 호환.

import { PDFDocument as EncryptedPDFDocument } from "pdf-lib-plus-encrypt";
import { PDFDocument } from "pdf-lib";

export type EncryptBits = 256 | 128 | 40;

/**
 * PDF 잠금. 표준 AES-256 (PDF 1.7 ExtensionLevel 8) 또는 AES-128 (PDF 1.6).
 * @param userPassword 열람용 비밀번호
 * @param ownerPassword 편집·인쇄 제한용 (생략 시 userPassword 동일)
 * @param bits 256(AES-256·권장) | 128(AES-128·호환성) | 40(RC4-40·약함)
 */
export async function encryptPdf(
  input: Uint8Array,
  userPassword: string,
  ownerPassword: string = userPassword,
  bits: EncryptBits = 256
): Promise<Uint8Array> {
  if (!userPassword) throw new Error("비밀번호를 입력해 주세요.");
  // ArrayBuffer 변환 (Uint8Array 그대로 넘기면 일부 환경에서 문제)
  const ab = new ArrayBuffer(input.byteLength);
  new Uint8Array(ab).set(input);

  const pdfDoc = await EncryptedPDFDocument.load(ab);

  // pdfVersion에 따라 암호화 강도 결정:
  //  - "1.7" + AES-256 (R5/V5)
  //  - "1.6" + AES-128 (R4/V4)
  //  - "1.4" + RC4-128 (R3/V2)
  const pdfVersion = bits === 256 ? "1.7" : bits === 128 ? "1.6" : "1.4";

  await pdfDoc.encrypt({
    userPassword,
    ownerPassword,
    pdfVersion,
    permissions: {
      printing: "highResolution",
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false,
    },
  });

  const out = await pdfDoc.save();
  return out instanceof Uint8Array ? out : new Uint8Array(out);
}

/**
 * PDF 잠금 해제 — pdfjs로 비밀번호 입력해서 열고, 각 페이지를 JPEG 이미지로
 * 렌더링하여 새 PDF에 임베드. 텍스트 검색·복사는 불가능해지지만 시각적 내용은 보존.
 *
 * @param dpi 렌더링 해상도 (150 = 표준, 300 = 인쇄 품질)
 * @param quality JPEG 압축 품질 (0.6 ~ 0.95)
 * @param onProgress 진행률 콜백 (current, total)
 */
export async function decryptPdfByRender(
  input: Uint8Array,
  password: string,
  options: {
    dpi?: number;
    quality?: number;
    onProgress?: (current: number, total: number) => void;
  } = {}
): Promise<Uint8Array> {
  const { dpi = 150, quality = 0.9, onProgress } = options;
  const scale = dpi / 72;

  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(input),
      password,
    }).promise;
  } catch (e) {
    if (e && typeof e === "object" && "name" in e) {
      const name = (e as { name: string }).name;
      if (name === "PasswordException") {
        throw new Error("비밀번호가 틀렸거나 비어 있습니다.");
      }
      if (name === "InvalidPDFException") {
        throw new Error("손상되거나 지원하지 않는 PDF입니다.");
      }
    }
    throw e instanceof Error ? e : new Error("PDF를 열 수 없습니다.");
  }

  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(i, pdf.numPages);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const baseVp = page.getViewport({ scale: 1 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 컨텍스트를 만들 수 없습니다.");

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob) continue;

    const bytes = new Uint8Array(await blob.arrayBuffer());
    const jpg = await newDoc.embedJpg(bytes);

    const newPage = newDoc.addPage([baseVp.width, baseVp.height]);
    newPage.drawImage(jpg, {
      x: 0,
      y: 0,
      width: baseVp.width,
      height: baseVp.height,
    });
  }

  const out = await newDoc.save();
  return out;
}

