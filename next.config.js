/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external images for QR code generation
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qr.sepay.vn',
        port: '',
        pathname: '/img',
      },
    ],
    unoptimized: true, // Allow unoptimized images for PDF generation
  },

  // Optimize for serverless deployment
  serverExternalPackages: ['playwright'],

  // Headers for PDF generation
  async headers() {
    return [
      {
        source: '/api/pdf/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
