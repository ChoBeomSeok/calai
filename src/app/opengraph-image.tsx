import { ImageResponse } from "next/og";

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
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 220,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          cal<span style={{ color: "#fde047" }}>ai</span>
        </div>
        <div
          style={{
            fontSize: 44,
            opacity: 0.9,
            marginTop: 24,
            letterSpacing: "0.02em",
          }}
        >
          Free Tools &amp; Calculators
        </div>
        <div
          style={{
            fontSize: 30,
            opacity: 0.75,
            marginTop: 12,
            letterSpacing: "0.02em",
          }}
        >
          BMI &middot; Loan &middot; Tax &middot; PDF &middot; 100+ tools
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 26,
            opacity: 0.8,
            letterSpacing: "0.04em",
          }}
        >
          calai.kr
        </div>
      </div>
    ),
    { ...size },
  );
}
