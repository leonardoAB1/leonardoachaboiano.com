import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leonardo Acha Boiano",
    short_name: "LAB",
    description:
      "Engineering portfolio of Leonardo Acha Boiano, mechatronics engineer.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c1a1a",
    theme_color: "#02777C",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
