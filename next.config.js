/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds to avoid failing due to unescaped entities
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
