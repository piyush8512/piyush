/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Using remotePatterns is safer and recommended for Next.js 13/14+
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'www.digitalons.com',
      },
    ],
  },
};

module.exports = nextConfig;