import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow local images in public directory
    unoptimized: false,
  },
  allowedDevOrigins: ['192.168.29.78', '172.20.10.8', '192.168.52.63'],
};

export default nextConfig;
