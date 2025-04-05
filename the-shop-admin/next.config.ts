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
};

export default nextConfig;
