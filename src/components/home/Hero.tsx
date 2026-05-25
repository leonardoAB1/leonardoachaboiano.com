"use client";

import { motion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
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
import { Link } from "@/i18n/navigation";
import { resolveTimelineEntry } from "@/lib/timeline-content";
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

  const t = useTranslations("Home.Hero");
  const tCommon = useTranslations("Common");
  const tTimeline = useTranslations("Timeline");
  const locale = useLocale();
  // Merge structural entries with the active locale's text + formatted dates.
  const entries = timelineEntries.map((entry) =>
    resolveTimelineEntry(entry, tTimeline, locale),
  );

  useEffect(() => {
    // Start downloading the globe bundle and its heavy dependencies immediately
    // when the hero mounts. By the time GlobeVisualization renders and calls
    // its own dynamic imports, the modules are already in the browser cache.
    void import("./GlobeVisualization");
    void import("three");
    void import("three-globe");
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
                <Eyebrow>{tCommon("role")}</Eyebrow>
              </motion.div>
              <motion.div variants={item}>
                <Heading
                  as="h1"
                  size="xl"
                  // Fluid size (clamp) so long localized headings scale down to
                  // fit the column instead of overflowing into the timeline;
                  // break-words + hyphens wrap anything still too wide. The
                  // clamp is repeated for the sm: variant to override the
                  // size="xl" responsive font-size.
                  className="max-w-4xl break-words [hyphens:auto] text-[clamp(2rem,5vw,3rem)] leading-tight sm:text-[clamp(2rem,5vw,3rem)]"
                >
                  {t.rich("heading", {
                    // Smaller, de-emphasized qualifier on its own line. Locales
                    // without a <small> tag in their heading render as plain text.
                    small: (chunks) => (
                      <span className="mt-1 block font-normal text-ink-3 text-2xl sm:text-3xl">
                        {chunks}
                      </span>
                    ),
                  })}
                </Heading>
              </motion.div>
              <motion.div variants={item}>
                <Text className="max-w-2xl text-ink-2" size="lg">
                  {t("intro")}
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
                  href="/cv"
                >
                  {t("viewCv")}
                </Link>
                <Link
                  className={cn(
                    buttonClasses({ size: "lg", variant: "secondary" }),
                    "text-center",
                  )}
                  href="/contact"
                >
                  {t("getInTouch")}
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
                    className="absolute start-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border"
                  />
                  <ul className="flex flex-col gap-6">
                    {entries.map((entry, index) => {
                      const isActive = index === selectedIndex;
                      return (
                        <motion.li
                          key={entry.id}
                          variants={timelineItem}
                          className="relative flex gap-5 ps-8"
                        >
                          <div
                            aria-hidden="true"
                            className={cn(
                              "absolute start-0 top-[6px] h-3 w-3 rounded-full border-2 border-brand transition-colors duration-200",
                              isActive ? "bg-brand" : "bg-surface-0",
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => handleSelect(index)}
                            className={cn(
                              "flex w-full flex-col gap-0.5 text-start transition-opacity duration-200",
                              !isActive && "opacity-50 hover:opacity-80",
                            )}
                            aria-pressed={isActive}
                          >
                            <span className="text-xs text-ink-4">
                              {entry.dateRange}
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
                <GlobeVisualization
                  activeIndex={selectedIndex}
                  activeLabel={entries[selectedIndex].location}
                />
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      <GlobeModal
        entry={isModalOpen ? entries[selectedIndex] : null}
        activeIndex={selectedIndex}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
