/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output only for Docker (`DOCKER_BUILD=1`); keeps Cloudflare Pages adapter working
  ...(process.env.DOCKER_BUILD === '1' ? { output: 'standalone' } : {}),
  // Cloudflare Pages / next-on-pages: don't fail the adapter build on legacy lint debt
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
