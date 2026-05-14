"use client";

import { useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";

type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [position, setPosition] = useState<Position>("center");
  const [rotation, setRotation] = useState(45);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | null) => {
    setFile(f);
    setError("");
  };

  const handleAdd = async () => {
    if (!file || !text) return;
    setProcessing(true);
    setError("");
    try {
      const { PDFDocument, StandardFonts, rgb, degrees } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // 한글 포함 여부 감지 → 한글 폰트 임베드 (NanumGothic Bold)
      const hasKorean = /[\u3131-\uD79D]/.test(text);
      let font;
      if (hasKorean) {
        const fontkitModule = await import("@pdf-lib/fontkit");
        pdf.registerFontkit(fontkitModule.default);
        // jsDelivr CDN의 NanumGothic Bold TTF (한국 공공 폰트, OFL 라이선스)
        const fontUrl = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/nanumgothic/NanumGothic-Bold.ttf";
        const fontBytes = await fetch(fontUrl).then((r) => {
          if (!r.ok) throw new Error("한글 폰트 다운로드 실패");
          return r.arrayBuffer();
        });
        font = await pdf.embedFont(fontBytes, { subset: true });
      } else {
        font = await pdf.embedFont(StandardFonts.HelveticaBold);
      }

      pdf.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        let x = 0,
          y = 0;
        const margin = 40;
        switch (position) {
          case "center":
            x = (width - textWidth) / 2;
            y = height / 2;
            break;
          case "top-left":
            x = margin;
            y = height - margin - fontSize;
            break;
          case "top-right":
            x = width - textWidth - margin;
            y = height - margin - fontSize;
            break;
          case "bottom-left":
            x = margin;
            y = margin;
            break;
          case "bottom-right":
            x = width - textWidth - margin;
            y = margin;
            break;
        }
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: position === "center" ? degrees(rotation) : degrees(0),
        });
      });

      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}_watermarked.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(`처리 실패: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <CalculatorLayout
      title="PDF 워터마크 (무료)"
      description="PDF에 텍스트 워터마크를 무료로 추가. 위치·투명도·회전 조정 가능. 가입·서명 없이 즉시 사용, 브라우저 내 처리."
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0] || null);
          }}
          className={`block cursor-pointer rounded-xl border-2 border-dashed p-12 sm:p-16 text-center transition ${
            dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
          }`}
        >
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="text-5xl sm:text-6xl mb-4">💧</div>
          {file ? (
            <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">{file.name}</div>
          ) : (
            <>
              <div className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">PDF 파일을 드래그하거나 클릭해서 선택</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">100% 무료 · 브라우저 내 처리</div>
            </>
          )}
        </label>

        {file && (
          <>
            <label className="block mt-5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">워터마크 텍스트 (한글·영문)</span>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="기밀 / CONFIDENTIAL"
                className="mt-1.5 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 font-mono"
              />
              <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400">
                ✓ 한글·영문 모두 지원 (한글 입력 시 NanumGothic 자동 임베드, 약 2MB 다운로드)
              </span>
            </label>

            <div className="mt-5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">위치</span>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: "top-left", l: "↖ 좌상" },
                  { v: "center", l: "● 중앙" },
                  { v: "top-right", l: "↗ 우상" },
                  { v: "bottom-left", l: "↙ 좌하" },
                  { v: "bottom-right", l: "↘ 우하" },
                ] as const).map((p) => (
                  <button
                    key={p.v}
                    onClick={() => setPosition(p.v)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium border transition ${
                      position === p.v
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {p.l}
                  </button>
                ))}
              </div>
            </div>

            <label className="block mt-5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                폰트 크기: {fontSize}pt
              </span>
              <input
                type="range"
                min="12"
                max="100"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="mt-1.5 block w-full"
              />
            </label>

            <label className="block mt-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                투명도: {(opacity * 100).toFixed(0)}%
              </span>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity * 100}
                onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                className="mt-1.5 block w-full"
              />
            </label>

            {position === "center" && (
              <label className="block mt-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  회전: {rotation}°
                </span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="mt-1.5 block w-full"
                />
              </label>
            )}

            <button
              onClick={handleAdd}
              disabled={processing || !text}
              className="w-full mt-5 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {processing ? (/[\u3131-\uD79D]/.test(text) ? "한글 폰트 다운로드 중..." : "처리 중...") : "💧 워터마크 추가 (무료)"}
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-300">
        🔒 <strong>100% 안전</strong>: 파일이 서버로 전송되지 않습니다.
      </div>
    </CalculatorLayout>
  );
}
