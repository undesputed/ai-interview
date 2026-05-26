import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Default lookup paths include ./src/i18n/request.ts — letting the plugin
// auto-resolve avoids a Turbopack absolute-path edge case.
const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ai-interview/shared'],
};

export default withNextIntl(config);
