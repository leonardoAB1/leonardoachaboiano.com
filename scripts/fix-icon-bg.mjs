// One-off script: adds a solid #02777C background to icon.png and apple-icon.png
// so they display correctly in square contexts (WhatsApp, Windows tiles, etc.)
// Run with: node scripts/fix-icon-bg.mjs
import sharp from "sharp";
import { readFileSync } from "fs";

async function addSolidBackground(inputPath, outputPath, width, height, color) {
  const { r, g, b } = color;

  const background = await sharp({
    create: { width, height, channels: 4, background: { r, g, b, alpha: 1 } },
  })
    .png()
    .toBuffer();

  const original = readFileSync(inputPath);

  await sharp(background)
    .composite([{ input: original, blend: "over" }])
    .toFile(outputPath);

  console.log(`Updated: ${outputPath} (${width}x${height})`);
}

const teal = { r: 2, g: 119, b: 124 }; // #02777C

await addSolidBackground(
  "src/app/icon.png",
  "src/app/icon.png",
  512,
  512,
  teal
);

await addSolidBackground(
  "src/app/apple-icon.png",
  "src/app/apple-icon.png",
  180,
  180,
  teal
);
