import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // 루트(/)에는 화면이 없으므로 시작 화면인 요금제 목록으로 보낸다 (사용자 결정)
  async redirects() {
    return [{ source: "/", destination: "/plans", permanent: false }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
