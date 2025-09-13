/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'pbxt.replicate.delivery',
      'g4yqcv8qdhf169fk.public.blob.vercel-storage.com',
    ],
  },
};

module.exports = nextConfig;
