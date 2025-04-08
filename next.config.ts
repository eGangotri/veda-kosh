import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {}
  },
  env: {
    VEDA_KOSH_ENV: process.env.VEDA_KOSH_ENV || 'development',
    PORT: process.env.PORT ? String(process.env.PORT) : "3001"
  },
  serverExternalPackages: ["mongodb"]
};

export default nextConfig;