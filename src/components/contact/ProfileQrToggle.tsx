"use client";

import Image from "next/image";
import { type ReactElement, useState } from "react";
import { cn } from "@/lib/utils";
import { ContactQr } from "./ContactQr";

interface ProfileQrToggleProps {
  photoSrc: string;
  photoAlt: string;
  qrAlt: string;
  /** QR geometry from `qrRoundedPath` (generated server-side). */
  qrPath: string;
  qrViewBox: string;
  /** Hint shown under the photo (e.g. "Tap for QR code"). */
  tapHint: string;
  /** Caption shown under the QR (e.g. "Scan to open my links"). */
  qrCaption: string;
  /** Accessible label when the photo is shown (action: reveal QR). */
  showQrLabel: string;
  /** Accessible label when the QR is shown (action: reveal photo). */
  showPhotoLabel: string;
  /** Squircle background shown behind the QR (e.g. "bg-white"). */
  qrBgClassName: string;
  /** Module color for the QR (text-* drives the SVG's currentColor). */
  qrColorClassName: string;
  /** Tailwind size class for the button square. Defaults to "size-48". */
  sizeClassName?: string;
}

// Squircle avatar that flips to a scannable QR on click. The photo is the
// default (keeps the page aesthetic); tapping reveals the rounded-module QR.
// Both layers stay mounted and cross-fade via opacity.
export function ProfileQrToggle({
  photoSrc,
  photoAlt,
  qrAlt,
  qrPath,
  qrViewBox,
  tapHint,
  qrCaption,
  showQrLabel,
  showPhotoLabel,
  qrBgClassName,
  qrColorClassName,
  sizeClassName = "size-48",
}: ProfileQrToggleProps): ReactElement {
  const [showQr, setShowQr] = useState(false);

  return (
    <figure className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setShowQr((v) => !v)}
        aria-label={showQr ? showPhotoLabel : showQrLabel}
        aria-pressed={showQr}
        className={cn(
          "relative overflow-hidden outline-offset-4 ring-1 ring-brand/50 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-brand",
          sizeClassName,
        )}
      >
        {/* Photo layer */}
        <Image
          src={photoSrc}
          alt={photoAlt}
          fill
          sizes="12rem"
          priority
          className={cn(
            "object-cover transition-opacity duration-300",
            showQr && "opacity-0",
          )}
        />

        {/* QR layer - the squircle backing frames the rounded QR. The SVG's
            baked quiet zone keeps the modules off the rounded corners. */}
        <span
          aria-hidden={!showQr}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            qrBgClassName,
            showQr ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <ContactQr
            path={qrPath}
            viewBox={qrViewBox}
            title={qrAlt}
            className={cn("size-full", qrColorClassName)}
          />
        </span>
      </button>

      <figcaption className="text-xs text-ink-3">
        {showQr ? qrCaption : tapHint}
      </figcaption>
    </figure>
  );
}
