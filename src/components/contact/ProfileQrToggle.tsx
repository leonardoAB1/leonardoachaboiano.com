"use client";

import Image from "next/image";
import { type ReactElement, useState } from "react";
import { cn } from "@/lib/utils";

interface ProfileQrToggleProps {
  photoSrc: string;
  photoAlt: string;
  qrSrc: string;
  qrAlt: string;
  /** Hint shown under the photo (e.g. "Tap for QR code"). */
  tapHint: string;
  /** Caption shown under the QR (e.g. "Scan to open my links"). */
  qrCaption: string;
  /** Accessible label when the photo is shown (action: reveal QR). */
  showQrLabel: string;
  /** Accessible label when the QR is shown (action: reveal photo). */
  showPhotoLabel: string;
}

// Squircle avatar that flips to a scannable QR on click. The photo is the
// default (keeps the page aesthetic); tapping reveals the QR so it can be shown
// or scanned. Both layers stay mounted and cross-fade via opacity, so the QR is
// laid out (and stays crisp) rather than mounting on demand.
export function ProfileQrToggle({
  photoSrc,
  photoAlt,
  qrSrc,
  qrAlt,
  tapHint,
  qrCaption,
  showQrLabel,
  showPhotoLabel,
}: ProfileQrToggleProps): ReactElement {
  const [showQr, setShowQr] = useState(false);

  return (
    <figure className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setShowQr((v) => !v)}
        aria-label={showQr ? showPhotoLabel : showQrLabel}
        aria-pressed={showQr}
        className="relative size-40 overflow-hidden rounded-[22%] outline-offset-4 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-brand"
      >
        {/* Photo layer */}
        <Image
          src={photoSrc}
          alt={photoAlt}
          fill
          sizes="10rem"
          priority
          className={cn(
            "object-cover transition-opacity duration-300",
            showQr && "opacity-0",
          )}
        />

        {/* QR layer - white fill keeps it scannable in any theme */}
        <span
          aria-hidden={!showQr}
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-white p-5 transition-opacity duration-300",
            showQr ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <span className="relative size-full">
            <Image
              src={qrSrc}
              alt={qrAlt}
              fill
              sizes="10rem"
              className="object-contain"
            />
          </span>
        </span>
      </button>

      <figcaption className="text-xs text-ink-3">
        {showQr ? qrCaption : tapHint}
      </figcaption>
    </figure>
  );
}
