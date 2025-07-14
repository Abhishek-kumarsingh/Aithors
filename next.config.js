/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export to allow server-side features
  output: undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    DEEPSHEEK_API_KEY: process.env.DEEPSHEEK_API_KEY,
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
  },
  // Enable experimental features for better server/client boundary handling
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Optimize CSS loading to prevent preload warnings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Webpack configuration for better CSS handling
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
