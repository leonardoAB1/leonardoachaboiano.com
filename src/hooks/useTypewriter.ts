"use client";

import { useEffect, useState } from "react";

// Milliseconds between each character while typing/deleting, and how long to
// pause at the "fully typed" and "fully deleted" ends of the cycle. Deleting
// is faster than typing, matching how a real typewriter effect reads: typing
// draws attention, deleting is just the transition out of the way.
const TYPING_MS_PER_CHAR = 55;
const DELETING_MS_PER_CHAR = 30;
const PAUSE_AFTER_TYPED_MS = 1800;
const PAUSE_AFTER_DELETED_MS = 300;

// Under prefers-reduced-motion, per-character typing is skipped entirely -
// each phrase is shown in full and simply held before the next one replaces
// it. The hold is longer than the full-motion "pause after typed" because
// there's no typing animation drawing the reader's eye first.
const REDUCED_MOTION_HOLD_MS = 2600;

interface UseTypewriterResult {
  text: string;
  isDeleting: boolean;
}

export function useTypewriter(
  phrases: string[],
  prefersReducedMotion: boolean,
): UseTypewriterResult {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    if (prefersReducedMotion) {
      const timeout = setTimeout(() => {
        setPhraseIndex((index) => (index + 1) % phrases.length);
      }, REDUCED_MOTION_HOLD_MS);
      return () => clearTimeout(timeout);
    }

    const currentPhrase = phrases[phraseIndex % phrases.length];

    if (!isDeleting && subIndex === currentPhrase.length) {
      const timeout = setTimeout(
        () => setIsDeleting(true),
        PAUSE_AFTER_TYPED_MS,
      );
      return () => clearTimeout(timeout);
    }

    if (isDeleting && subIndex === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
      }, PAUSE_AFTER_DELETED_MS);
      return () => clearTimeout(timeout);
    }

    const speed = isDeleting ? DELETING_MS_PER_CHAR : TYPING_MS_PER_CHAR;
    const timeout = setTimeout(() => {
      setSubIndex((count) => count + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [phrases, phraseIndex, subIndex, isDeleting, prefersReducedMotion]);

  if (phrases.length === 0) {
    return { text: "", isDeleting: false };
  }

  if (prefersReducedMotion) {
    return { text: phrases[phraseIndex % phrases.length], isDeleting: false };
  }

  return {
    text: phrases[phraseIndex % phrases.length].slice(0, subIndex),
    isDeleting,
  };
}
