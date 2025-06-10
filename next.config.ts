import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization to avoid issues with dynamic requires
  output: 'standalone',
  // Experimental features
  experimental: {
    // Add any experimental features here if needed
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include fs/path modules in client-side code
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
