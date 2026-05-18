"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { type ReactElement, useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
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
       * `relative overflow-hidden` on Section:
       * - `relative` makes it the containing block for the absolute globe
       * - `overflow-hidden` clips the globe where it bleeds off the right edge
       */}
      <Section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-10">

        {/*
         * Globe: absolutely positioned at section level so it escapes the
         * Container's max-width constraint and can fill the full right side.
         * `pointer-events-none` so it doesn't block clicks on the timeline.
         * Hidden on mobile - the modal handles mobile.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block"
          style={{ right: "-10vw", width: "70vw", height: "70vw" }}
        >
          <GlobeVisualization activeIndex={selectedIndex} />
        </div>

        <Container>
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
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
            </motion.div>
          </div>
        </Container>
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
