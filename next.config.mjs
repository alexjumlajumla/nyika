import withNextIntl from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntlConfig = withNextIntl(
  // Path to the internationalization configuration
  './src/i18n/config.ts',
  // Optional: enable automatic static optimization for pages
  {
    // Enable automatic static optimization for all pages
    // This is the default in production
    // Set to 'force-dynamic' to disable static optimization
    // for pages that use dynamic features
    // forceDynamic: true,
  }
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // i18n configuration is handled by next-intl
  // Add any other Next.js config options here
  output: 'standalone',
  webpack: (config) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/messages': path.resolve(__dirname, './src/messages'),
      '@/config': path.resolve(__dirname, './src/config')
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable cross-origin resource sharing (CORS)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default withNextIntlConfig(nextConfig);
