import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ fontSize: 140, fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>
          cal<span style={{ color: "#fde047" }}>ai</span>
        </div>
        <div style={{ fontSize: 36, color: "rgba(255,255,255,0.85)", marginTop: 16 }}>
          한국에서 가장 빠른 도구·계산기
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
          BMI · PDF · 마크다운 · SQL · Cron · 97개+ 무료
        </div>
      </div>
    ),
    { ...size }
  );
}
