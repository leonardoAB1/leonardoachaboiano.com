import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// MDX plugin options (remark/rehype) are applied server-side during compilation
// in src/lib/mdx.ts rather than here, because Turbopack cannot serialize
// function-type plugin options required by the loader mechanism.
const withMDX = createMDX({});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default withMDX(nextConfig);
