import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Bundle inspection: builds use Turbopack, where @next/bundle-analyzer does
// not work. Audit chunk weight per route with the built-in analyzer instead:
// pnpm exec next experimental-analyze

const withMDX = createMDX({});
// Points next-intl at the per-request config so getTranslations/useTranslations
// resolve the active locale's messages during server rendering.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  serverExternalPackages: ["@react-pdf/renderer"],
  // Pin the project root explicitly. Without this, Turbopack/Next infer the
  // root by climbing for a lockfile - and since every git worktree (see
  // CLAUDE.md <worktree>) carries its own pnpm-lock.yaml nested under the
  // main repo's, that climb can resolve to the main repo instead of the
  // worktree actually being run, serving stale code.
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default withNextIntl(withMDX(nextConfig));
