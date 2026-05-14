import sharp from "sharp";

const HEAD_SCALE = 0.85;

async function generate(inputPath, outputPath, outputSize) {
  // Sample the background color from a corner pixel
  const { data } = await sharp(inputPath)
    .resize(outputSize, outputSize)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const r = data[0];
  const g = data[1];
  const b = data[2];

  const scaledSize = Math.round(outputSize * HEAD_SCALE);
  const offset = Math.round((outputSize - scaledSize) / 2);

  // Radius -1 keeps the anti-aliased edge pixel inside the canvas so it
  // blends against the green fill rather than producing a white halo.
  const circlesvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outputSize}" height="${outputSize}">` +
    `<circle cx="${outputSize / 2}" cy="${outputSize / 2}" r="${outputSize / 2 - 1}" fill="white"/>` +
    `</svg>`,
  );

  const scaledAvatar = await sharp(inputPath)
    .resize(scaledSize, scaledSize)
    .toBuffer();

  await sharp({
    create: {
      width: outputSize,
      height: outputSize,
      channels: 4,
      background: { r, g, b, alpha: 1 },
    },
  })
    .composite([
      { input: scaledAvatar, top: offset, left: offset },
      { input: circlesvg, blend: "dest-in" },
    ])
    .png()
    .toFile(outputPath);

  console.log(`generated ${outputPath} (${outputSize}px, head at ${HEAD_SCALE * 100}%)`);
}

await generate(
  "src/app/icon.png",
  "src/app/icon.png",
  512,
);

await generate(
  "src/app/apple-icon.png",
  "src/app/apple-icon.png",
  180,
);
