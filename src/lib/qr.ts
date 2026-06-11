import QRCode from "qrcode";

// Shared QR generator. Produces only the *geometry* of a QR code (an SVG path
// plus a viewBox) so the same matrix can be rendered in two very different
// targets: a DOM <svg> on the contact page and a @react-pdf/renderer <Svg> in
// the CV PDF. Colour and background are chosen by each consumer.
//
// IMPORTANT: this module imports `qrcode` (a Node/JS lib, ~14 KB). Import it
// ONLY from server code (route handlers, server components). The client never
// needs it - it receives the finished `path` string as a plain prop.

export interface QrPath {
  /** SVG "d" for every dark module, in a 1-unit-per-module coordinate space. */
  path: string;
  /** viewBox including a 2-module quiet zone, e.g. "-2 -2 33 33". */
  viewBox: string;
}

// Half a module. Rounding a corner by this radius turns isolated modules into
// circles and merges adjacent ones into smooth blobs - the same look as the
// original hand-built contact QR (which used `A0.5 0.5 0 0 1` arcs).
const R = 0.5;

// Trace one dark module clockwise from the top edge. A corner is rounded only
// when BOTH orthogonal neighbours touching it are empty, so solid regions
// (finder patterns, clusters) keep crisp inner edges and round only on the
// outside.
function modulePath(
  x: number,
  y: number,
  tl: boolean,
  tr: boolean,
  br: boolean,
  bl: boolean,
): string {
  const x1 = x + 1;
  const y1 = y + 1;
  const arc = (ex: number, ey: number) => `A${R} ${R} 0 0 1 ${ex} ${ey}`;

  let d = `M${x + (tl ? R : 0)} ${y}`;
  d += `L${x1 - (tr ? R : 0)} ${y}`;
  if (tr) d += arc(x1, y + R);
  d += `L${x1} ${y1 - (br ? R : 0)}`;
  if (br) d += arc(x1 - R, y1);
  d += `L${x + (bl ? R : 0)} ${y1}`;
  if (bl) d += arc(x, y1 - R);
  d += `L${x} ${y + (tl ? R : 0)}`;
  if (tl) d += arc(x + R, y);
  return `${d}Z`;
}

/**
 * Build a rounded-module QR code for `text` and return its SVG geometry.
 * Uses error-correction level M (the QR default) so it stays scannable even
 * when printed small or partially smudged.
 */
export function qrRoundedPath(text: string): QrPath {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  const size = modules.size;
  const on = (x: number, y: number) =>
    x >= 0 &&
    y >= 0 &&
    x < size &&
    y < size &&
    modules.data[y * size + x] === 1;

  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!on(x, y)) continue;
      const top = on(x, y - 1);
      const bottom = on(x, y + 1);
      const left = on(x - 1, y);
      const right = on(x + 1, y);
      path += modulePath(
        x,
        y,
        !top && !left,
        !top && !right,
        !bottom && !right,
        !bottom && !left,
      );
    }
  }

  return { path, viewBox: `-2 -2 ${size + 4} ${size + 4}` };
}
