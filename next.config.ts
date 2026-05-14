import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'd375139ucebi94.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'kluruxhjziayommqnfeo.supabase.co',
      },
    ],
    qualities: [70, 75, 80, 85],
  },
}

export default nextConfig
