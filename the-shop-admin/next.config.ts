import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eqmcbbkvlkpcszzbjmuo.supabase.co",
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set your preferred limit here
    },
  },
};

export default nextConfig;
