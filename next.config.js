/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    // For Docker deployment
    outputFileTracingIncludes: {
      '/': ['./prisma/**/*'],
    },
  },
  // For standalone deployment
  output: 'standalone',
}

module.exports = nextConfig