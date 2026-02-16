import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
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
