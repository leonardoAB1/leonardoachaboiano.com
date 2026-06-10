"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import type { ReactElement, ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

// Async feature loading keeps the animation engine out of the initial bundle:
// m.* components render with a tiny core (~6 kB) and the full feature set
// arrives in a parallel chunk right after hydration.
const loadMotionFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

export function Providers({ children }: ProvidersProps): ReactElement {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MotionConfig reducedMotion="user">
        {/* strict makes any leftover eager motion.* component throw in
            development, so a missed m.* rename cannot re-bloat the bundle. */}
        <LazyMotion features={loadMotionFeatures} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </ThemeProvider>
  );
}
