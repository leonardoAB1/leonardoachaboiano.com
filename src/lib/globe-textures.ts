export const GLOBE_TEXTURES = {
  blueMarble: "/globe/earth-blue-marble.jpg",
  topology: "/globe/earth-topology.png",
  night: "/globe/earth-night.jpg",
  clouds: "/globe/earth-clouds.webp",
} as const;

export const GLOBE_TEXTURE_PRELOAD_HREFS: readonly string[] = [
  GLOBE_TEXTURES.blueMarble,
  GLOBE_TEXTURES.topology,
  GLOBE_TEXTURES.night,
  GLOBE_TEXTURES.clouds,
];
