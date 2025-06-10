import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configure images
  images: {
    domains: [
      'localhost',
      'your-supabase-url.supabase.co',
      'images.unsplash.com',
      'source.unsplash.com',
      'lh3.googleusercontent.com',
      '*.googleusercontent.com',
      '*.supabase.co',
      '*.supabase.in',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configure webpack
  webpack: (config, { isServer, dev, webpack }) => {
    // Add an alias for the messages directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/messages': resolve(__dirname, 'src/messages'),
      '@/lib': resolve(__dirname, 'src/lib'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/styles': resolve(__dirname, 'src/styles'),
      '@/public': resolve(__dirname, 'public'),
    };
    
    // Add file loader for images (only in development)
    if (dev && !isServer) {
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/_next',
              name: 'static/media/[name].[hash:8].[ext]',
              esModule: false,
            },
          },
        ],
      });
    }

    // Add support for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Add support for WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    // Add support for Web Workers
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    config.output.publicPath = '/_next/';

    return config;
  },
  
  // Enable source maps in production for better error tracking
  productionBrowserSourceMaps: true,
  
  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en', // Default to English
        permanent: false,
        locale: false,
      },
    ];
  },
  
  // Configure rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx'],
  
  // Configure trailing slash
  trailingSlash: false,
  
  // Configure powered by header
  poweredByHeader: false,
};

export default nextConfig;
