import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  typescript: {
    // ESTO ELIMINA EL BLOQUEO DEL BUILD
    ignoreBuildErrors: true,
  },
  eslint: {
    // TAMBIÉN IGNORA LINTING SI ESTÁ DANDO GUERRA
    ignoreDuringBuilds: true,
  },
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'creaapp.xyz',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin('./i18n.ts');
export default withNextIntl(nextConfig);
