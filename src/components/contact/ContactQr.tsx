// Renders QR geometry produced server-side by `qrRoundedPath` (src/lib/qr.ts).
// Monochrome - colour comes from the parent's text colour (fill="currentColor")
// so the same markup themes to white-on-brand on the contact card.
import type { ReactElement } from "react";

export function ContactQr({
  path,
  viewBox,
  className,
  title,
}: {
  /** SVG "d" for the QR modules. */
  path: string;
  /** viewBox string (includes the quiet zone). */
  viewBox: string;
  className?: string;
  title?: string;
}): ReactElement {
  return (
    <svg
      viewBox={viewBox}
      fill="currentColor"
      role="img"
      aria-label={title}
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
