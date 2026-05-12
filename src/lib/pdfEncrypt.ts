"use client";

// PDF 잠금 wrapper — pdf-lib-plus-encrypt 기반
// pthread/SharedArrayBuffer 미사용. 100% 메인 스레드 동작.
// 표준 PDF 암호화 (AES-128 / AES-256). Adobe·Chrome·Preview 모두 호환.

import { PDFDocument as EncryptedPDFDocument } from "pdf-lib-plus-encrypt";

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
