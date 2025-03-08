import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {}
  },
  serverExternalPackages: ["mongodb"]
};

export default nextConfig;