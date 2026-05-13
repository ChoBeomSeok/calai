import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)",
          color: "white",
          position: "relative",
        }}
      >
        {/* 큰 calai 로고 */}
        <div
          style={{
            fontSize: 240,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            display: "flex",
          }}
        >
          <span>cal</span>
          <span style={{ color: "#fde047" }}>ai</span>
        </div>

        {/* 부제 */}
        <div
          style={{
            fontSize: 46,
            fontWeight: 600,
            marginTop: 28,
            opacity: 0.95,
            letterSpacing: "0.01em",
          }}
        >
          Free Tools &amp; Calculators
        </div>

        {/* 도구 카테고리 */}
        <div
          style={{
            fontSize: 28,
            marginTop: 18,
            opacity: 0.8,
            letterSpacing: "0.03em",
            display: "flex",
            gap: 16,
          }}
        >
          <span>BMI</span>
          <span>·</span>
          <span>Loan</span>
          <span>·</span>
          <span>Tax</span>
          <span>·</span>
          <span>PDF</span>
          <span>·</span>
          <span>Background Removal</span>
          <span>·</span>
          <span>100+</span>
        </div>

        {/* 하단 도메인 */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 30,
            opacity: 0.85,
            letterSpacing: "0.05em",
            fontWeight: 500,
          }}
        >
          calai.kr
        </div>

        {/* 우상단 작은 액센트 */}
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 56,
            fontSize: 24,
            opacity: 0.6,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          No Sign-up &middot; Browser-Only
        </div>
      </div>
    ),
    size,
  );
}
