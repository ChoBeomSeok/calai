"use client";

// qpdf-wasm 래퍼. WASM 모듈은 사용 시점에 lazy 로드되고 모듈 캐시에 보관된다.
// public/qpdf.wasm 파일을 fetch 하므로 locateFile은 "/qpdf.wasm" 반환.

type QpdfFS = {
  writeFile: (path: string, data: Uint8Array) => void;
  readFile: (path: string) => Uint8Array;
  unlink: (path: string) => void;
};

type QpdfModule = {
  FS: QpdfFS;
  callMain: (args: string[]) => number;
};

let modulePromise: Promise<QpdfModule> | null = null;

async function getModule(): Promise<QpdfModule> {
  if (modulePromise) return modulePromise;
  modulePromise = (async () => {
    const mod = (await import("qpdf-wasm/qpdf.js")) as unknown as {
      default: (opts: object) => Promise<QpdfModule>;
    };
    const stderr: string[] = [];
    const m = await mod.default({
      locateFile: (p: string) => `/${p}`,
      noInitialRun: true,
      print: () => {},
      printErr: (msg: string) => {
        stderr.push(msg);
      },
    });
    return m;
  })();
  return modulePromise;
}

function safeUnlink(M: QpdfModule, path: string) {
  try {
    M.FS.unlink(path);
  } catch {
    // 없으면 무시
  }
}

/**
 * PDF 잠금 — AES-256 / AES-128 표준 암호화
 * @param userPassword 열람용 비밀번호
 * @param ownerPassword 편집·인쇄 제한용 비밀번호 (생략 시 userPassword와 동일)
 * @param bits 키 길이 (256·128·40)
 */
export async function encryptPdf(
  input: Uint8Array,
  userPassword: string,
  ownerPassword: string = userPassword,
  bits: 256 | 128 | 40 = 256
): Promise<Uint8Array> {
  if (!userPassword) throw new Error("비밀번호를 입력해 주세요.");
  const M = await getModule();
  const inPath = "/in.pdf";
  const outPath = "/out.pdf";
  safeUnlink(M, inPath);
  safeUnlink(M, outPath);
  M.FS.writeFile(inPath, input);
  let code: number;
  try {
    code = M.callMain([
      "--encrypt",
      userPassword,
      ownerPassword,
      String(bits),
      "--",
      inPath,
      outPath,
    ]);
  } catch (e) {
    safeUnlink(M, inPath);
    throw new Error(`PDF 잠금 실패: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (code !== 0) {
    safeUnlink(M, inPath);
    safeUnlink(M, outPath);
    throw new Error(`PDF 잠금 실패 (exit ${code}). 손상된 PDF이거나 이미 잠긴 파일일 수 있습니다.`);
  }
  try {
    const out = M.FS.readFile(outPath);
    return new Uint8Array(out);
  } finally {
    safeUnlink(M, inPath);
    safeUnlink(M, outPath);
  }
}

/**
 * PDF 잠금 해제 — 비밀번호 알고 있을 때 원본 보존하여 해제
 */
export async function decryptPdf(input: Uint8Array, password: string): Promise<Uint8Array> {
  const M = await getModule();
  const inPath = "/in.pdf";
  const outPath = "/out.pdf";
  safeUnlink(M, inPath);
  safeUnlink(M, outPath);
  M.FS.writeFile(inPath, input);
  let code: number;
  try {
    code = M.callMain([
      "--decrypt",
      `--password=${password}`,
      inPath,
      outPath,
    ]);
  } catch (e) {
    safeUnlink(M, inPath);
    throw new Error(`PDF 해제 실패: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (code !== 0) {
    safeUnlink(M, inPath);
    safeUnlink(M, outPath);
    throw new Error("비밀번호가 틀렸거나 PDF가 손상되었습니다.");
  }
  try {
    const out = M.FS.readFile(outPath);
    return new Uint8Array(out);
  } finally {
    safeUnlink(M, inPath);
    safeUnlink(M, outPath);
  }
}

/**
 * 미리 로드. 사용자가 페이지 진입 시 호출하면 첫 작업 지연 감소.
 */
export function preloadQpdf(): void {
  void getModule();
}
