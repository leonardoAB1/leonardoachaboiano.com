"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { type ReactElement, useEffect, useState } from "react";
import { Section } from "@/components/layout/Section";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { timelineEntries } from "@/data/timeline";
import { cn } from "@/lib/utils";
import { GlobeModal } from "./GlobeModal";
import { GlobeVisualization } from "./GlobeVisualization";

// Reads the browser media query on the client. Returns false during SSR
// (server always renders as "desktop") then corrects after hydration.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const timelineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
};

const timelineItem: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero(): ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    if (isMobile) setIsModalOpen(true);
  };

  return (
    <>
      {/*
       * z-[1] puts the entire hero section (and its globe) above subsequent
       * sibling sections in the stacking order, so the globe can visually
       * overlap the top of the next section.
       * overflow-hidden is intentionally removed so the globe can bleed
       * downward past the section boundary. The parent page wrapper still
       * has overflow-hidden which clips the right-side bleed.
       */}
      <Section className="relative z-[1] flex min-h-[calc(100svh-3.5rem)] flex-col justify-center pb-16 pt-8 sm:pb-20 sm:pt-10">
        {/*
         */}
        <div
          aria-hidden="true"
          className="absolute hidden lg:block"
          style={{
            right: "6vw",
            bottom: "2vh",
            width: "min(65vw, calc(100svh - 3.5rem))",
            height: "min(65vw, calc(100svh - 3.5rem))",
            // Soft radial mask instead of hard border-radius clip.
            // border-radius+overflow:hidden creates a sharp dark ring where the
            // Three.js sphere doesn't quite reach the circle edge.
            // A gradient mask fades the edges to transparent, hiding the gap
            // and blending the atmosphere glow naturally into the page.
            WebkitMaskImage:
              "radial-gradient(circle at center, black 52%, transparent 72%)",
            maskImage:
              "radial-gradient(circle at center, black 52%, transparent 72%)",
          }}
        >
          <GlobeVisualization activeIndex={selectedIndex} />
        </div>

        {/* Left-anchored: no mx-auto so both columns sit toward the left edge,
            putting the timeline near the horizontal centre of the viewport. */}
        <div className="w-full max-w-5xl px-6 sm:px-8 lg:ml-64">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[2fr_3fr] lg:gap-12">
            {/* Left: hero copy */}
            <motion.div
              className="flex flex-col gap-8"
              initial="hidden"
              animate="show"
              variants={container}
            >
              <motion.div variants={item}>
                <Eyebrow>Mechatronics engineer</Eyebrow>
              </motion.div>
              <motion.div variants={item}>
                <Heading as="h1" className="max-w-4xl" size="xl">
                  Proud generalist
                </Heading>
              </motion.div>
              <motion.div variants={item}>
                <Text className="max-w-2xl text-ink-2" size="lg">
                  I work across embedded systems, robotics integration, and
                  design for manufacturing, from prototypes to production-ready
                  installations.
                </Text>
              </motion.div>
              <motion.div
                variants={item}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <Link
                  className={cn(
                    buttonClasses({ size: "lg", variant: "primary" }),
                    "text-center",
                  )}
                  href="/projects"
                >
                  View projects
                </Link>
                <Link
                  className={cn(
                    buttonClasses({ size: "lg", variant: "secondary" }),
                    "text-center",
                  )}
                  href="/cv"
                >
                  View CV
                </Link>
              </motion.div>
            </motion.div>

            {/*
             * Right column: the clickable timeline. On desktop it overlays
             * on top of the globe (which is absolutely positioned at section
             * level behind everything).
             */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={timelineContainer}
              className="relative z-10"
            >
              {/*
               * Scroll container: caps visible height at ~6 entries.
               * overflow-x-hidden prevents any horizontal bleed.
               * The inner div.relative is the positioning context for the
               * vertical line — its height is the full content height, not
               * the clipped viewport, so h-[calc(100%-1rem)] spans all entries.
               */}
              <div
                className="max-h-[28rem] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                }}
              >
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border"
                  />
                  <ul className="flex flex-col gap-6">
                    {timelineEntries.map((entry, index) => {
                      const isActive = index === selectedIndex;
                      return (
                        <motion.li
                          key={entry.date + entry.org}
                          variants={timelineItem}
                          className="relative flex gap-5 pl-8"
                        >
                          {/* Active dot is filled; inactive is hollow */}
                          <div
                            aria-hidden="true"
                            className={cn(
                              "absolute left-0 top-[6px] h-3 w-3 rounded-full border-2 border-brand transition-colors duration-200",
                              isActive ? "bg-brand" : "bg-surface-0",
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => handleSelect(index)}
                            className={cn(
                              "flex w-full flex-col gap-0.5 text-left transition-opacity duration-200",
                              !isActive && "opacity-50 hover:opacity-80",
                            )}
                            aria-pressed={isActive}
                          >
                            <span className="text-xs text-ink-4">
                              {entry.date}
                            </span>
                            <p className="text-sm font-semibold text-ink-1">
                              {entry.role}
                            </p>
                            <p className="text-xs text-ink-2">
                              {entry.org}&nbsp;&middot;&nbsp;{entry.location}
                            </p>
                            {entry.note && (
                              <p className="text-xs text-ink-3">{entry.note}</p>
                            )}
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Mobile: fullscreen globe sheet, shown when a role is tapped */}
      <GlobeModal
        entry={isModalOpen ? timelineEntries[selectedIndex] : null}
        activeIndex={selectedIndex}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
