import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this directory. A stray package-lock.json in the
  // parent (converty/) otherwise makes Turbopack infer the parent as root and
  // resolve node_modules from there, which breaks `tailwindcss` resolution.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
