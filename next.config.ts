import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {}
  },
  env: {
    VEDA_KOSH_ENV: process.env.VEDA_KOSH_ENV || 'development',
  },
  serverExternalPackages: ["mongodb"]
};

export default nextConfig;