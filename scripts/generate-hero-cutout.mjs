import sharp from "sharp";

const SOURCE_WITH_PERSON = "C:/Users/ZEPHYRUS/Downloads/portrait-hero-original.webp";
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
// Both are essential for the torso/jacket, but they're also exactly what
// destroys hair: strands are 1-3px wide, well inside both radii, so they get
// smoothed into a blobby outline. The hair region is computed as a second,
// much lighter matte (HAIR_*) and blended in near the top of the frame.
const CLOSE_RADIUS = 12;
const OPEN_RADIUS = 7;

// Hair matte: no denoise, no morphology, tighter feather - preserves
// individual strands instead of smoothing them into a silhouette blob. Even
// a 3x3 median erases single-pixel-wide strand tips (their neighborhood is
// dominated by background, so the median "votes" them away), so this uses
// the raw diff directly.
const HAIR_FEATHER_SIGMA = 0.4;
// Guards the hair matte against picking up unrelated high-contrast noise far
// from the person (e.g. cloud/skyline edges) - only trust it within this
// many px of the coarse body silhouette. Generous, since flyaway strands can
// extend well past the coarse (morphologically closed) blob's edge.
const HAIR_VALIDITY_DILATE = 40;
// How far below the top of the head the hair matte applies, and the width of
// the linear blend zone down into the coarse (torso) matte beneath it. Sized
// generously to clear the ears/sideburns (not just the crown) while staying
// well above the jacket collar / wall-artifact zone lower in the frame.
const HAIR_REGION_HEIGHT = 350;
const HAIR_BLEND_MARGIN = 80;

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

function dilate(buf, width, height, radius) {
  return boxFilter(buf, width, height, radius, "max");
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

// Soft threshold (smoothstep) for an anti-aliased alpha ramp.
function smoothstepThreshold(buf) {
  const out = Buffer.alloc(buf.length);
  for (let p = 0; p < buf.length; p++) {
    const v = buf[p];
    if (v <= DIFF_LOW) out[p] = 0;
    else if (v >= DIFF_HIGH) out[p] = 255;
    else {
      const t = (v - DIFF_LOW) / (DIFF_HIGH - DIFF_LOW);
      out[p] = Math.round(t * t * (3 - 2 * t) * 255);
    }
  }
  return out;
}

// sharp's median()/blur() silently upconvert a single-channel raw buffer to
// 3 channels internally; extractChannel(0) forces it back to 1 channel so
// the buffer size matches the {channels: 1} we declare when reading it back.
async function median(buf, width, height, size) {
  return sharp(buf, { raw: { width, height, channels: 1 } })
    .median(size)
    .extractChannel(0)
    .raw()
    .toBuffer();
}

async function blur(buf, width, height, sigma) {
  return sharp(buf, { raw: { width, height, channels: 1 } })
    .blur(sigma)
    .extractChannel(0)
    .raw()
    .toBuffer();
}

function findTopmostOnRow(buf, width, height) {
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      if (buf[rowOffset + x] > 127) return y;
    }
  }
  return 0;
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

  // --- Coarse matte: robust body/torso silhouette ---
  const denoised = await median(diff, width, height, MEDIAN_SIZE);
  const softAlpha = smoothstepThreshold(denoised);

  let binary = Buffer.alloc(softAlpha.length);
  for (let p = 0; p < softAlpha.length; p++) binary[p] = softAlpha[p] > 127 ? 255 : 0;
  binary = close(binary, width, height, CLOSE_RADIUS);
  binary = open(binary, width, height, OPEN_RADIUS);

  const keepMask = keepLargestComponent(binary, width, height);
  const filledMask = fillEnclosedHoles(keepMask, width, height);

  const coarseAlpha = Buffer.alloc(filledMask.length);
  for (let p = 0; p < coarseAlpha.length; p++) coarseAlpha[p] = filledMask[p] ? 255 : 0;
  const coarseFeathered = await blur(coarseAlpha, width, height, FEATHER_SIGMA);

  // --- Fine matte: crisp hair detail, no denoise, no morphology ---
  const hairSoft = smoothstepThreshold(diff);
  const validityZone = dilate(keepMask.map((v) => v * 255), width, height, HAIR_VALIDITY_DILATE);
  const fineAlpha = Buffer.alloc(hairSoft.length);
  for (let p = 0; p < fineAlpha.length; p++) {
    fineAlpha[p] = validityZone[p] > 127 ? hairSoft[p] : 0;
  }
  const fineFeathered = await blur(fineAlpha, width, height, HAIR_FEATHER_SIGMA);

  // --- Blend: fine matte near the top of the head, coarse everywhere else ---
  const headTopY = findTopmostOnRow(keepMask, width, height);
  const hairRegionEnd = headTopY + HAIR_REGION_HEIGHT;
  const blended = Buffer.alloc(width * height);
  for (let y = 0; y < height; y++) {
    const fullFineBelow = hairRegionEnd - HAIR_BLEND_MARGIN;
    let weight;
    if (y <= fullFineBelow) weight = 1;
    else if (y >= hairRegionEnd) weight = 0;
    else weight = (hairRegionEnd - y) / HAIR_BLEND_MARGIN;
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const p = rowOffset + x;
      blended[p] = Math.round(weight * fineFeathered[p] + (1 - weight) * coarseFeathered[p]);
    }
  }

  await sharp(blended, { raw: { width, height, channels: 1 } }).png().toFile(DEBUG_MATTE);

  // Composite: RGB from the with-person source, alpha from the blended matte.
  // Semi-transparent edge pixels (hair wisps especially) are a blend of the
  // true foreground color and the background showing through, not pure
  // foreground - compositing them as-is leaves a background-tinted fringe
  // (a teal halo here). Since the exact background color at every pixel is
  // known (the clean plate), it can be unmixed out proportionally to alpha:
  // fg = bg + (observed - bg) / alpha. This is the same idea as Photoshop's
  // "Decontaminate Colors", but exact instead of estimated, because the true
  // background is known rather than guessed from nearby pixels.
  const outRgba = Buffer.alloc(width * height * 4);
  for (let i = 0, p = 0; i < outRgba.length; i += 4, p++) {
    const alpha01 = blended[p] / 255;
    if (alpha01 > 0.02 && alpha01 < 0.98) {
      for (let c = 0; c < 3; c++) {
        const observed = a[i + c];
        const bg = b[i + c];
        const fg = bg + (observed - bg) / alpha01;
        outRgba[i + c] = Math.max(0, Math.min(255, Math.round(fg)));
      }
    } else {
      outRgba[i] = a[i];
      outRgba[i + 1] = a[i + 1];
      outRgba[i + 2] = a[i + 2];
    }
    outRgba[i + 3] = blended[p];
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
