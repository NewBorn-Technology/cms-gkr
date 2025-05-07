/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // This adds trailing slash to URLs, which helps with static hosting
  trailingSlash: true,
  // Change output directory from 'out' to 'build' for Render
  distDir: 'build',
};

module.exports = nextConfig; 