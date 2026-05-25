import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withMDX = createMDX({});
// Points next-intl at the per-request config so getTranslations/useTranslations
// resolve the active locale's messages during server rendering.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default withNextIntl(withMDX(nextConfig));
