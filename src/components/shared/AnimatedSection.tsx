"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactElement, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps): ReactElement {
  return (
    <motion.div
      className={className}
      initial="hidden"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      variants={variants}
      viewport={{ margin: "-80px", once: true }}
      whileInView="show"
    >
      {children}
    </motion.div>
  );
}
