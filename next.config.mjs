/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Improve hydration handling
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  images: {
    unoptimized: true,
    domains: ['eurusworkflows.blob.core.windows.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eurusworkflows.blob.core.windows.net',
        port: '',
        pathname: '/eurusworkflows/images/**',
      },
    ],
  },
  // Compression and caching
  compress: true,
  poweredByHeader: false,
  // Only enable static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
  }),
  // Exclude problematic files from file watching and optimize webpack
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Optimize for development
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules',
          '**/.git',
          '**/.next',
          '**/out',
          '**/.DS_Store',
          '**/Thumbs.db',
          '**/*.log',
          '**/url-mappings.txt',
        ],
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    // Optimize for production
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }
    
    return config
  },
}

export default nextConfig
