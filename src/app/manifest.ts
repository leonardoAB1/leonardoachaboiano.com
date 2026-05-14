import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leonardo Acha Boiano",
    short_name: "LAB",
    description:
      "Engineering portfolio of Leonardo Acha Boiano, mechatronics and robotics engineer.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c1a1a",
    theme_color: "#02777C",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
