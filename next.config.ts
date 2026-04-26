import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "next-blog-acbbc.appspot.com",
      },
      {
        protocol: "https",
        hostname: "next-blog-acbbc.firebasestorage.app", // optional, legacy or manually generated
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
};

export default nextConfig;
