import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A lockfile in a parent directory otherwise makes Turbopack infer the wrong
  // workspace root and warn on every build.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },

  // Type errors previously suppressed the build. The codebase compiles clean,
  // so a regression should fail the build rather than reach production.
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    // The logo is a ~600KB PNG; optimisation serves it as AVIF/WebP at the
    // handful of sizes actually rendered.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
  },

  // Pulls only the icons each module imports rather than the whole package.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default withNextIntl(nextConfig)
