import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "mekship-develop.s3.ap-southeast-1.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
