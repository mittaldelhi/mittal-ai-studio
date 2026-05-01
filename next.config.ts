import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    memoryBasedWorkersCount: false,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lagnzrzlpuvzdxtwmknw.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
    };

    return config;
  },
};

export default nextConfig;
