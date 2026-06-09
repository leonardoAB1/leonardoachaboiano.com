"use client";

import { useEffect, useState } from "react";

// Generic matchMedia hook. Returns false on the server and on the first
// client render, then syncs to the real match - a mobile-first default, so
// SSR markup and the hydration render never disagree.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
