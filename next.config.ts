import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
  },
  allowedDevOrigins: ['192.168.29.78', '172.20.10.8', '192.168.52.63'],
};

export default nextConfig;
