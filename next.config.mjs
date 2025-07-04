/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Only enable static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  // Exclude problematic files from file watching
  webpack: (config, { dev, isServer }) => {
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
        ],
      }
    }
    return config
  },
}

export default nextConfig
