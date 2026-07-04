import sharp from "sharp";

const SOURCE_WITH_PERSON = "public/images/portrait-hero.webp";
const SOURCE_CLEAN_PLATE = "C:/Users/ZEPHYRUS/Downloads/portrait-hero-background.png";
const OUT_BACKGROUND = "public/images/portrait-hero-background.webp";
const OUT_PERSON = "public/images/portrait-hero-person.webp";
const DEBUG_MATTE = "test-artifacts/hero-matte-debug.png";

// Difference-matting thresholds, tuned by eye against DEBUG_MATTE.
// Below DIFF_LOW: fully transparent (background). Above DIFF_HIGH: fully
// opaque (person). Between: smoothstep ramp for an anti-aliased edge.
const DIFF_LOW = 18;
const DIFF_HIGH = 55;
const MEDIAN_SIZE = 5;
const FEATHER_SIGMA = 1.2;

// The two source photos were shot handheld, a moment apart, so every
// high-contrast edge in the scene (the stone parapet's top edge in
// particular) shifted by a pixel or two between shots. That shift produces
// a thin diff "outline" tracing those edges, including straight through the
// person's torso where they lean on the wall. Two morphological passes clean
// this up:
// - CLOSE_RADIUS: dilate-then-erode fills small dark holes/gaps sitting
//   inside the silhouette (the wall-edge line, patterned jacket lining).
// - OPEN_RADIUS: erode-then-dilate trims thin light protrusions that
//   survive outside the silhouette (the same wall-edge line trailing off
//   past the person toward the frame edges).
const CLOSE_RADIUS = 12;
const OPEN_RADIUS = 7;

// Square-kernel local max/min filter over a single-channel buffer. Plain
// nested loops are fine here - this is a one-off build script, not runtime
// code, and 1.5M px is trivial for Node to chew through once.
function boxFilter(buf, width, height, radius, pick) {
  const out = Buffer.alloc(width * height);
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - radius);
    const y1 = Math.min(height - 1, y + radius);
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(width - 1, x + radius);
      let acc = pick === "max" ? 0 : 255;
      for (let ny = y0; ny <= y1; ny++) {
        const rowOffset = ny * width;
        for (let nx = x0; nx <= x1; nx++) {
          const v = buf[rowOffset + nx];
          if (pick === "max" ? v > acc : v < acc) acc = v;
        }
      }
      out[y * width + x] = acc;
    }
  }
  return out;
}

function close(buf, width, height, radius) {
  return boxFilter(boxFilter(buf, width, height, radius, "max"), width, height, radius, "min");
}

function open(buf, width, height, radius) {
  return boxFilter(boxFilter(buf, width, height, radius, "min"), width, height, radius, "max");
}

// Keeps only the largest 4-connected blob of "on" pixels (buf[p] > 127),
// discarding smaller disconnected specks - e.g. skyline compression noise
// far from the person, which survives denoising as isolated dots/blobs.
function keepLargestComponent(buf, width, height) {
  const n = width * height;
  const visited = new Uint8Array(n);
  const isOn = (p) => buf[p] > 127;
  const stack = new Int32Array(n);

  let bestStart = -1;
  let bestSize = 0;

  for (let start = 0; start < n; start++) {
    if (visited[start] || !isOn(start)) continue;
    let size = 0;
    let sp = 0;
    stack[sp++] = start;
    visited[start] = 1;
    while (sp > 0) {
      const p = stack[--sp];
      size++;
      const x = p % width;
      const y = (p - x) / width;
      if (x > 0 && !visited[p - 1] && isOn(p - 1)) {
        visited[p - 1] = 1;
        stack[sp++] = p - 1;
      }
      if (x < width - 1 && !visited[p + 1] && isOn(p + 1)) {
        visited[p + 1] = 1;
        stack[sp++] = p + 1;
      }
      if (y > 0 && !visited[p - width] && isOn(p - width)) {
        visited[p - width] = 1;
        stack[sp++] = p - width;
      }
      if (y < height - 1 && !visited[p + width] && isOn(p + width)) {
        visited[p + width] = 1;
        stack[sp++] = p + width;
      }
    }
    if (size > bestSize) {
      bestSize = size;
      bestStart = start;
    }
  }

  const keep = new Uint8Array(n);
  if (bestStart >= 0) {
    visited.fill(0);
    let sp = 0;
    stack[sp++] = bestStart;
    visited[bestStart] = 1;
    keep[bestStart] = 1;
    while (sp > 0) {
      const p = stack[--sp];
      const x = p % width;
      const y = (p - x) / width;
      if (x > 0 && !visited[p - 1] && isOn(p - 1)) {
        visited[p - 1] = 1;
        keep[p - 1] = 1;
        stack[sp++] = p - 1;
      }
      if (x < width - 1 && !visited[p + 1] && isOn(p + 1)) {
        visited[p + 1] = 1;
        keep[p + 1] = 1;
        stack[sp++] = p + 1;
      }
      if (y > 0 && !visited[p - width] && isOn(p - width)) {
        visited[p - width] = 1;
        keep[p - width] = 1;
        stack[sp++] = p - width;
      }
      if (y < height - 1 && !visited[p + width] && isOn(p + width)) {
        visited[p + width] = 1;
        keep[p + width] = 1;
        stack[sp++] = p + width;
      }
    }
  }
  return keep;
}

// Fills holes fully enclosed by foreground - a safety net for anything the
// close/open passes above didn't fully bridge. A background pixel counts as
// "real" background only if it's reachable from the image border without
// crossing foreground; anything unreachable is enclosed and gets promoted.
// The bottom border isn't seeded: the crop is top-anchored (object-top /
// object-right-top), so the bottom edge is the least trustworthy border for
// deciding "this is genuinely see-through" - a hole only reachable via the
// bottom is far more likely to be a leftover compression artifact than a
// real gap, so it gets closed too.
function fillEnclosedHoles(mask, width, height) {
  const n = width * height;
  const reachable = new Uint8Array(n);
  const stack = new Int32Array(n);
  let sp = 0;

  const tryPush = (p) => {
    if (!mask[p] && !reachable[p]) {
      reachable[p] = 1;
      stack[sp++] = p;
    }
  };

  for (let x = 0; x < width; x++) {
    tryPush(x);
  }
  for (let y = 0; y < height; y++) {
    tryPush(y * width);
    tryPush(y * width + width - 1);
  }

  while (sp > 0) {
    const p = stack[--sp];
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) tryPush(p - 1);
    if (x < width - 1) tryPush(p + 1);
    if (y > 0) tryPush(p - width);
    if (y < height - 1) tryPush(p + width);
  }

  const filled = new Uint8Array(n);
  for (let p = 0; p < n; p++) {
    filled[p] = mask[p] || !reachable[p] ? 1 : 0;
  }
  return filled;
}

async function main() {
  const [withPerson, cleanPlate] = await Promise.all([
    sharp(SOURCE_WITH_PERSON).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(SOURCE_CLEAN_PLATE).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);

  if (
    withPerson.info.width !== cleanPlate.info.width ||
    withPerson.info.height !== cleanPlate.info.height
  ) {
    throw new Error("source images are not pixel-aligned - resize/re-align before diffing");
  }

  const { width, height } = withPerson.info;
  const a = withPerson.data;
  const b = cleanPlate.data;

  // Per-pixel RGB color distance -> single-channel grayscale diff map.
  const diff = Buffer.alloc(width * height);
  for (let i = 0, p = 0; i < a.length; i += 4, p++) {
    const dr = a[i] - b[i];
    const dg = a[i + 1] - b[i + 1];
    const db = a[i + 2] - b[i + 2];
    diff[p] = Math.min(255, Math.sqrt(dr * dr + dg * dg + db * db));
  }

  // Denoise: removes webp/PNG compression speckle. sharp's median() silently
  // upconverts a single-channel raw buffer to 3 channels internally;
  // extractChannel(0) forces it back to 1 channel so the buffer size matches
  // the {channels: 1} we declare when reading it back.
  const denoised = await sharp(diff, { raw: { width, height, channels: 1 } })
    .median(MEDIAN_SIZE)
    .extractChannel(0)
    .raw()
    .toBuffer();

  // Soft threshold (smoothstep) for an anti-aliased alpha ramp. Kept as the
  // source of truth for edge softness at the true silhouette boundary.
  const softAlpha = Buffer.alloc(denoised.length);
  for (let p = 0; p < denoised.length; p++) {
    const v = denoised[p];
    if (v <= DIFF_LOW) softAlpha[p] = 0;
    else if (v >= DIFF_HIGH) softAlpha[p] = 255;
    else {
      const t = (v - DIFF_LOW) / (DIFF_HIGH - DIFF_LOW);
      softAlpha[p] = Math.round(t * t * (3 - 2 * t) * 255);
    }
  }

  // Morphological cleanup on a binarized copy - see the constants' doc
  // comment above for why close-then-open (in that order) is needed.
  let binary = Buffer.alloc(softAlpha.length);
  for (let p = 0; p < softAlpha.length; p++) binary[p] = softAlpha[p] > 127 ? 255 : 0;
  binary = close(binary, width, height, CLOSE_RADIUS);
  binary = open(binary, width, height, OPEN_RADIUS);

  const keepMask = keepLargestComponent(binary, width, height);
  const filledMask = fillEnclosedHoles(keepMask, width, height);

  // Compose final alpha from the cleaned binary decision alone (0 or 255),
  // not from the original per-pixel softAlpha value: softAlpha still carries
  // the wall-edge/compression noise that close+open+keep+fill just removed,
  // and reusing it here would let that noise straight back into the result.
  // The feather blur below is what re-introduces anti-aliasing at the edge.
  const alpha = Buffer.alloc(filledMask.length);
  for (let p = 0; p < alpha.length; p++) {
    alpha[p] = filledMask[p] ? 255 : 0;
  }

  // Final feather for edge anti-aliasing. blur() has the same channel
  // upconversion quirk as median(), see note above.
  const feathered = await sharp(alpha, { raw: { width, height, channels: 1 } })
    .blur(FEATHER_SIGMA)
    .extractChannel(0)
    .raw()
    .toBuffer();

  await sharp(feathered, { raw: { width, height, channels: 1 } }).png().toFile(DEBUG_MATTE);

  // Composite: RGB from the with-person source, alpha from the computed matte.
  const outRgba = Buffer.alloc(width * height * 4);
  for (let i = 0, p = 0; i < outRgba.length; i += 4, p++) {
    outRgba[i] = a[i];
    outRgba[i + 1] = a[i + 1];
    outRgba[i + 2] = a[i + 2];
    outRgba[i + 3] = feathered[p];
  }

  await sharp(outRgba, { raw: { width, height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(OUT_PERSON);

  await sharp(SOURCE_CLEAN_PLATE).webp({ quality: 90 }).toFile(OUT_BACKGROUND);

  console.log(`wrote ${DEBUG_MATTE}`);
  console.log(`wrote ${OUT_BACKGROUND}`);
  console.log(`wrote ${OUT_PERSON}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
