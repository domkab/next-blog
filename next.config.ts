import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/next-blog-acbbc.appspot.com/o/**',
      },
      {
        protocol: 'https',
        hostname: 'next-blog-acbbc.appspot.com',
      },
      {
        protocol: 'https',
        hostname: 'next-blog-acbbc.firebasestorage.app', // optional, legacy or manually generated
      },
      {
        protocol: 'https',
        hostname: 'www.hostinger.com',
      },
    ],
  },
};

export default nextConfig;