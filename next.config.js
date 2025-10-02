/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build for deployment
  },
  // For Docker deployment
  outputFileTracingIncludes: {
    '/': ['./prisma/**/*'],
  },
  // For standalone deployment
  output: 'standalone',
}

module.exports = nextConfig