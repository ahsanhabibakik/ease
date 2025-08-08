import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'hi', 'bn', 'fr'],
    defaultLocale: 'en',
  },
  /* config options here */
};

export default nextConfig;
