import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
  // reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

export default nextConfig;
