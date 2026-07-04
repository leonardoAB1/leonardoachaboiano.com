// Generates the contact page's paper background tiles into public/img/.
// Two layers per theme, modeled on the reference site's technique:
//   paper-*.webp  - opaque base sheet with soft low-frequency mottling,
//                   tiled at 500px, static
//   fleck-*.png   - sparse speckles on transparency, tiled at 250px,
//                   jittered by the grain animation
// Both are generated from a seeded PRNG so re-running the script reproduces
// the committed assets bit-for-bit. Run: node scripts/generate-paper-textures.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SIZE = 512;
const OUT_DIR = path.join(import.meta.dirname, "..", "public", "img");

// mulberry32: tiny deterministic PRNG, good enough for texture scatter.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Periodic value noise: random values on a wrapping lattice, smoothly
// interpolated. Periodicity is what makes the tile seamless when repeated.
function makeValueNoise(rand, lattice) {
  const grid = Array.from({ length: lattice * lattice }, () => rand() * 2 - 1);
  const smooth = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const gx = (x / SIZE) * lattice;
    const gy = (y / SIZE) * lattice;
    const x0 = Math.floor(gx) % lattice;
    const y0 = Math.floor(gy) % lattice;
    const x1 = (x0 + 1) % lattice;
    const y1 = (y0 + 1) % lattice;
    const tx = smooth(gx - Math.floor(gx));
    const ty = smooth(gy - Math.floor(gy));
    const v00 = grid[y0 * lattice + x0];
    const v10 = grid[y0 * lattice + x1];
    const v01 = grid[y1 * lattice + x0];
    const v11 = grid[y1 * lattice + x1];
    const top = v00 + (v10 - v00) * tx;
    const bottom = v01 + (v11 - v01) * tx;
    return top + (bottom - top) * ty;
  };
}

async function generatePaper(fileName, baseRgb, amplitude, seed) {
  const rand = mulberry32(seed);
  const coarse = makeValueNoise(rand, 6);
  const fine = makeValueNoise(rand, 14);
  const data = Buffer.alloc(SIZE * SIZE * 3);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      // Two octaves of soft clouds; the fine octave is quieter so the sheet
      // reads as pressed paper rather than marble.
      const n = coarse(x, y) * 0.7 + fine(x, y) * 0.3;
      const i = (y * SIZE + x) * 3;
      for (let c = 0; c < 3; c++) {
        data[i + c] = Math.max(
          0,
          Math.min(255, Math.round(baseRgb[c] + n * amplitude)),
        );
      }
    }
  }
  await sharp(data, { raw: { width: SIZE, height: SIZE, channels: 3 } })
    .webp({ quality: 82 })
    .toFile(path.join(OUT_DIR, fileName));
}

async function generateFleck(fileName, rgb, seed) {
  const rand = mulberry32(seed);
  const data = Buffer.alloc(SIZE * SIZE * 4); // transparent RGBA
  const FLECKS = 1800;
  for (let f = 0; f < FLECKS; f++) {
    const cx = rand() * SIZE;
    const cy = rand() * SIZE;
    const radius = 0.5 + rand() * 1.1;
    // Kept faint on purpose: the reference speckle reads as paper dust, not
    // confetti - most flecks sit barely above the sheet.
    const alpha = 0.05 + rand() * 0.17;
    const bound = Math.ceil(radius) + 1;
    for (let dy = -bound; dy <= bound; dy++) {
      for (let dx = -bound; dx <= bound; dx++) {
        const dist = Math.hypot(dx - (cx % 1), dy - (cy % 1));
        const coverage = Math.max(0, Math.min(1, radius - dist + 0.5));
        if (coverage <= 0) continue;
        // Wrapping the coordinates keeps flecks that cross an edge seamless
        // when the tile repeats.
        const px = (((Math.floor(cx) + dx) % SIZE) + SIZE) % SIZE;
        const py = (((Math.floor(cy) + dy) % SIZE) + SIZE) % SIZE;
        const i = (py * SIZE + px) * 4;
        const a = Math.round(coverage * alpha * 255);
        if (a > data[i + 3]) {
          data[i] = rgb[0];
          data[i + 1] = rgb[1];
          data[i + 2] = rgb[2];
          data[i + 3] = a;
        }
      }
    }
  }
  await sharp(data, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .png({ palette: true })
    .toFile(path.join(OUT_DIR, fileName));
}

await mkdir(OUT_DIR, { recursive: true });
// Light theme: #ede7dc cream sheet, muted warm-gray flecks.
await generatePaper("paper.webp", [237, 231, 220], 3.5, 11);
await generateFleck("fleck.png", [128, 118, 102], 22);
// Dark theme: #0c1e20 teal-dark sheet, pale warm flecks.
await generatePaper("paper-dark.webp", [12, 30, 32], 3, 33);
await generateFleck("fleck-dark.png", [190, 202, 198], 44);
console.log("paper textures written to public/img/");
