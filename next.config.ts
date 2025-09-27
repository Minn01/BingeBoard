import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,  // Skip TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint errors  
  },
};

export default nextConfig;