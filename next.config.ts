import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ,
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint errors
  },
};

export default nextConfig;
