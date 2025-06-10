import withNextIntl from 'next-intl/plugin';

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
