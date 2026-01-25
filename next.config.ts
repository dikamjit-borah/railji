import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Required when using `output: "export"` so that `next/image`
    // does not rely on the missing `/_next/image` optimization route.
    unoptimized: true,
  },
};

export default nextConfig;
