import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.output.globalObject = 'self';
    return config;
  },
};

export default nextConfig;
