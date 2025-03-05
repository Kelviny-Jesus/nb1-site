/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'p8px6idkhmrxuren.public.blob.vercel-storage.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
    async rewrites() {
      return [
        {
          source: '/api/n8n/:path*',
          destination: 'https://n8n-blue.up.railway.app/webhook/nb1/:path*',
        },
      ];
    },
  };
  
  module.exports = nextConfig;
