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
          background: "#4f46e5",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 280,
            fontWeight: 900,
            letterSpacing: "-0.05em",
          }}
        >
          calai
        </div>
        <div
          style={{
            fontSize: 48,
            marginTop: 20,
            opacity: 0.85,
          }}
        >
          calai.kr
        </div>
      </div>
    ),
    size,
  );
}
