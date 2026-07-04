"use client";

import { m } from "framer-motion";
import type { ReactElement, ReactNode } from "react";
import { fadeSlideUp, viewport } from "@/lib/motion-variants";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps): ReactElement {
  return (
    <m.div
      className={className}
      initial="hidden"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      variants={fadeSlideUp}
      viewport={viewport}
      whileInView="show"
    >
      {children}
    </m.div>
  );
}
