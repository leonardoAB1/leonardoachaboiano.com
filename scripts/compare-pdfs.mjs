/**
 * PDF visual comparison script.
 *
 * Renders the original static PDF and the dynamically generated PDF to PNG
 * images using pdftoppm, then uses pixelmatch to produce a pixel diff.
 *
 * Usage:
 *   node scripts/compare-pdfs.mjs
 *
 * Requires the Next.js dev server to be running on port 3001.
 * Output: test-artifacts/{original,generated,diff}.png
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WT = join(__dirname, "..");
const ARTIFACTS = join(WT, "test-artifacts");
const PDFTOPPM = "pdftoppm";
const DPI = 150;

// ---------------------------------------------------------------------------

function renderPdfToPng(pdfPath, prefix) {
  execSync(`"${PDFTOPPM}" -r ${DPI} -png -f 1 -l 1 "${pdfPath}" "${prefix}"`, {
    stdio: "pipe",
  });
  // pdftoppm output for a 1-page PDF: {prefix}-1.png
  return `${prefix}-1.png`;
}

function loadPng(filePath) {
  return PNG.sync.read(readFileSync(filePath));
}

// Crops RGBA buffer to targetW x targetH if the image is larger.
function cropData(data, srcW, srcH, targetW, targetH) {
  if (srcW === targetW && srcH === targetH) return data;
  const out = Buffer.alloc(targetW * targetH * 4);
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const si = (y * srcW + x) * 4;
      const di = (y * targetW + x) * 4;
      out[di] = data[si];
      out[di + 1] = data[si + 1];
      out[di + 2] = data[si + 2];
      out[di + 3] = data[si + 3];
    }
  }
  return out;
}

// Box-average downsampling by `factor`. Each output pixel is the mean of a
// factor×factor block of input pixels. This makes 1-3 px position shifts from
// different font-metric tables average out within each block, while layout
// differences larger than `factor` px remain clearly visible.
function downsample(data, width, height, factor) {
  const newW = Math.floor(width / factor);
  const newH = Math.floor(height / factor);
  const out = Buffer.alloc(newW * newH * 4);
  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      let r = 0, g = 0, b = 0;
      for (let dy = 0; dy < factor; dy++) {
        for (let dx = 0; dx < factor; dx++) {
          const si = ((y * factor + dy) * width + (x * factor + dx)) * 4;
          r += data[si]; g += data[si + 1]; b += data[si + 2];
        }
      }
      const n = factor * factor;
      const di = (y * newW + x) * 4;
      out[di] = r / n; out[di + 1] = g / n;
      out[di + 2] = b / n; out[di + 3] = 255;
    }
  }
  return { data: out, width: newW, height: newH };
}

// ---------------------------------------------------------------------------

async function main() {
  const origPdfPath = join(ARTIFACTS, "original-cv.pdf");

  // Fetch the dynamically generated PDF from the running dev server.
  console.log("Fetching generated PDF from http://localhost:3001/en/cv/pdf ...");
  const res = await fetch("http://localhost:3001/en/cv/pdf");
  if (!res.ok) throw new Error(`GET /en/cv/pdf failed: HTTP ${res.status}`);
  const genPdfBuf = Buffer.from(await res.arrayBuffer());
  const genPdfPath = join(ARTIFACTS, "generated-cv.pdf");
  writeFileSync(genPdfPath, genPdfBuf);
  console.log(`  saved (${genPdfBuf.length} bytes)`);

  // Render both PDFs to PNG using pdftoppm.
  console.log(`\nRendering PDFs at ${DPI} DPI ...`);
  const origPngPath = renderPdfToPng(origPdfPath, join(ARTIFACTS, "original"));
  const genPngPath = renderPdfToPng(genPdfPath, join(ARTIFACTS, "generated"));

  // Load and compare.
  const img1 = loadPng(origPngPath);
  const img2 = loadPng(genPngPath);
  const { width: w1, height: h1 } = img1;
  const { width: w2, height: h2 } = img2;
  console.log(`  original:  ${w1} x ${h1} px`);
  console.log(`  generated: ${w2} x ${h2} px`);

  // Comparison uses the smaller of the two dimensions to handle minor size
  // differences between PDF generators.
  const width = Math.min(w1, w2);
  const height = Math.min(h1, h2);

  const data1 = cropData(img1.data, w1, h1, width, height);
  const data2 = cropData(img2.data, w2, h2, width, height);

  const diff = new PNG({ width, height });
  const numDiff = pixelmatch(data1, data2, diff.data, width, height, {
    threshold: 0.1,
  });

  const diffPath = join(ARTIFACTS, "diff.png");
  writeFileSync(diffPath, PNG.sync.write(diff));

  const total = width * height;
  const pct = ((numDiff / total) * 100).toFixed(2);

  console.log(`\nResult: ${numDiff.toLocaleString()} / ${total.toLocaleString()} pixels differ (${pct}%)`);
  console.log(`\nFiles written to test-artifacts/:`);
  console.log(`  original-1.png  — reference`);
  console.log(`  generated-1.png — output of dynamic route`);
  console.log(`  diff.png        — pixel diff (red = changed)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
