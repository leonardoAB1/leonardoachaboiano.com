"use client";

import { motion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { timelineEntries } from "@/data/timeline";
import { cn } from "@/lib/utils";
import { GlobeModal } from "./GlobeModal";
import { GlobePlaceholder } from "./GlobePlaceholder";

const GlobeVisualization = dynamic(
  () => import("./GlobeVisualization").then((mod) => mod.GlobeVisualization),
  { ssr: false, loading: () => <GlobePlaceholder /> },
);

function useIsMobile(): boolean {
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

const globeItem: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.5 },
  },
};

export function Hero(): ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFade, setShowFade] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    void import("./GlobeVisualization");
  }, []);

  const handleTimelineScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowFade(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    if (isMobile) setIsModalOpen(true);
  };

  return (
    <>
      <Section className="flex min-h-[calc(100svh-3.5rem)] flex-col justify-center pb-16 pt-8 sm:pb-20 sm:pt-10">
        <Container className="max-w-7xl">
          <motion.div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-8 xl:gap-10">
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

            <motion.div
              initial="hidden"
              animate="show"
              variants={timelineContainer}
            >
              <div
                ref={scrollRef}
                onScroll={handleTimelineScroll}
                className="max-h-[28rem] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={
                  showFade
                    ? {
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 70%, transparent 100%)",
                        maskImage:
                          "linear-gradient(to bottom, black 70%, transparent 100%)",
                      }
                    : undefined
                }
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

            <motion.div
              aria-hidden="true"
              className="hidden lg:flex lg:items-center lg:justify-center"
              initial="hidden"
              animate="show"
              variants={globeItem}
            >
              <div className="hero-globe-mask aspect-square w-full max-w-[min(100%,calc(100svh-10rem))]">
                <GlobeVisualization activeIndex={selectedIndex} />
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      <GlobeModal
        entry={isModalOpen ? timelineEntries[selectedIndex] : null}
        activeIndex={selectedIndex}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
