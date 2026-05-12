import type { NextConfig } from "next";

const crossOriginIsolated = [
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // qpdf-wasm은 SharedArrayBuffer 사용을 위해 cross-origin isolation 필요.
      // 외부 자원(GA·광고 등)이 차단되므로 PDF 보안 페이지에만 한정 적용.
      { source: "/pdf-password", headers: crossOriginIsolated },
      { source: "/pdf-batch", headers: crossOriginIsolated },
    ];
  },
};

export default nextConfig;
