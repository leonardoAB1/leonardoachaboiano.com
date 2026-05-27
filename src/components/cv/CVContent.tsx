"use client";

import { motion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SkillBadge } from "@/components/cv/SkillBadge";
import { TimelineEntry } from "@/components/cv/TimelineEntry";
import { GlobePlaceholder } from "@/components/home/GlobePlaceholder";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Separator } from "@/components/ui/Separator";
import { Eyebrow } from "@/components/ui/Typography";
import { timelineEntries } from "@/data/timeline";
import { resolveTimelineEntry } from "@/lib/timeline-content";
import { cn } from "@/lib/utils";

const GlobeVisualization = dynamic(
  () =>
    import("@/components/home/GlobeVisualization").then(
      (mod) => mod.GlobeVisualization,
    ),
  { ssr: false, loading: () => <GlobePlaceholder /> },
);

// ---------------------------------------------------------------------------
// Static non-translatable data (category/language/achievement ids key into
// message namespaces; skill tokens and flag codes are not translated)
// ---------------------------------------------------------------------------

const skillGroups: { categoryKey: string; skills: string[] }[] = [
  {
    categoryKey: "programming",
    skills: ["Python", "C/C++", "MATLAB", "Verilog/VHDL", "LaTeX"],
  },
  {
    categoryKey: "embeddedRobotics",
    skills: ["STM32", "ESP32", "ROS2", "FreeRTOS", "BLE", "CAN", "I2C", "MQTT"],
  },
  {
    categoryKey: "electronicsPcb",
    skills: [
      "KiCad",
      "Altium",
      "Proteus",
      "LTSpice",
      "Breadboarding",
      "Soldering",
    ],
  },
  {
    categoryKey: "mechanicalDesign",
    skills: [
      "SolidWorks",
      "Fusion 360",
      "AutoCAD",
      "DFMA",
      "GD&T",
      "CNC Lathe",
      "3D Printing",
      "Laser Cutting",
    ],
  },
  {
    categoryKey: "tools",
    skills: [
      "Git/GitHub",
      "MATLAB",
      "PLC (Tia Portal)",
      "Ladder",
      "FBD",
      "P&ID",
      "FluidSIM",
    ],
  },
];

const achievementKeys = [
  "icpc",
  "diplomaHonour2",
  "cswa",
  "diplomaHonour1",
  "scholarship",
  "rotary",
] as const;

const languages = [
  { nameKey: "spanish", levelKey: "native", countries: ["bo", "ar"] },
  { nameKey: "english", levelKey: "fluent", countries: ["us"] },
  { nameKey: "german", levelKey: "a2", countries: ["de", "ch"] },
  { nameKey: "italian", levelKey: "a2", countries: ["it"] },
] as const;

// ---------------------------------------------------------------------------
// Animation variants (copied from Hero.tsx)
// ---------------------------------------------------------------------------

const timelineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const timelineItem: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const globeSlide: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
};

// ---------------------------------------------------------------------------

export function CVContent(): ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFade, setShowFade] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  // One ref per timeline <li> so a globe-marker click can scroll the chosen
  // entry into view inside the scroll container.
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const t = useTranslations("CV");
  const tTimeline = useTranslations("Timeline");
  const tAchievements = useTranslations("Achievements");
  const locale = useLocale();

  // All 9 entries resolved once - reused for both the interactive timeline
  // list / globe and the filtered detailed sections below.
  const allEntries = timelineEntries.map((e) =>
    resolveTimelineEntry(e, tTimeline, locale),
  );

  const workEntries = allEntries.filter(
    (e) => e.type === "work" && e.cvVisible !== false,
  );
  const educationEntries = allEntries.filter(
    (e) => e.type === "education" && e.cvVisible !== false,
  );

  // Start downloading the globe bundle and its heavy deps immediately on mount
  // so they are in the browser cache when GlobeVisualization renders.
  useEffect(() => {
    void import("@/components/home/GlobeVisualization");
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
  };

  // Keep the selected entry visible in the timeline list. A globe-marker click
  // can select an entry that is scrolled out of view, so nudge the container
  // just enough to reveal it. The bottom margin matches the fade mask zone.
  useEffect(() => {
    const container = scrollRef.current;
    const item = itemRefs.current[selectedIndex];
    if (!container || !item) return;
    const c = container.getBoundingClientRect();
    const i = item.getBoundingClientRect();
    const topMargin = 8;
    const bottomMargin = container.clientHeight * 0.3;
    if (i.top < c.top + topMargin) {
      container.scrollBy({
        top: i.top - c.top - topMargin,
        behavior: "smooth",
      });
    } else if (i.bottom > c.bottom - bottomMargin) {
      container.scrollBy({
        top: i.bottom - c.bottom + bottomMargin,
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  return (
    <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[1fr_22rem] lg:gap-x-12">
      {/* Left column: interactive timeline navigator + detailed CV sections */}
      <div className="space-y-10">
        {/* Career history: interactive timeline list that drives the globe */}
        <div>
          <Eyebrow className="mb-6">{t("sections.careerHistory")}</Eyebrow>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
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
                  {allEntries.map((entry, index) => {
                    const isActive = index === selectedIndex;
                    return (
                      <motion.li
                        key={entry.id}
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
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
        </div>

        <Separator />

        {/* Work Experience */}
        <AnimatedSection delay={0.05}>
          <Eyebrow className="mb-6">{t("sections.work")}</Eyebrow>
          <div>
            {workEntries.map((entry) => (
              <TimelineEntry
                key={entry.id}
                dateRange={entry.dateRange}
                role={entry.role}
                org={entry.org}
                location={entry.location}
                bullets={entry.bullets}
                note={entry.note}
              />
            ))}
          </div>
        </AnimatedSection>

        <Separator />

        {/* Education */}
        <AnimatedSection delay={0.1}>
          <Eyebrow className="mb-6">{t("sections.education")}</Eyebrow>
          <div>
            {educationEntries.map((entry) => (
              <TimelineEntry
                key={entry.id}
                dateRange={entry.dateRange}
                role={entry.role}
                org={entry.org}
                location={entry.location}
                note={entry.note}
              />
            ))}
          </div>
        </AnimatedSection>

        <Separator />

        {/* Skills */}
        <AnimatedSection delay={0.1}>
          <Eyebrow className="mb-6">{t("sections.skills")}</Eyebrow>
          <div className="space-y-6">
            {skillGroups.map(({ categoryKey, skills }) => (
              <div
                key={categoryKey}
                className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr] sm:gap-8"
              >
                <p className="text-sm font-medium text-ink-2 sm:pt-1">
                  {t(`skillCategories.${categoryKey}`)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillBadge key={skill} label={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Right column: globe (desktop only) + languages/achievements panel.
          The globe is hidden on mobile; the panel always renders and stacks
          below the left column on narrow screens. */}
      <div className="lg:sticky lg:top-14 lg:self-start lg:flex lg:flex-col lg:h-[calc(100svh-3.5rem)]">
        {/* Globe: desktop only - hidden on mobile */}
        <motion.div
          className="hidden overflow-hidden rounded-2xl lg:block lg:aspect-square lg:w-full lg:flex-shrink-0"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={globeSlide}
        >
          <GlobeVisualization
            activeIndex={selectedIndex}
            activeLabel={allEntries[selectedIndex].location}
            onSelectIndex={handleSelect}
          />
        </motion.div>

        {/* Languages and Achievements: scrolls internally on desktop so the
            globe always stays visible at the top of the sticky column */}
        <div className="space-y-8 pt-6 lg:flex-1 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
          <AnimatedSection delay={0.15}>
            <Eyebrow className="mb-6">{t("sections.languages")}</Eyebrow>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              {languages.map(({ nameKey, levelKey, countries }) => (
                <div key={nameKey} className="flex flex-col gap-1.5">
                  <span className="sr-only">
                    {t(`languageNames.${nameKey}`)}
                  </span>
                  <div className="flex gap-1">
                    {countries.map((code) => (
                      <Image
                        key={code}
                        alt=""
                        className="rounded-sm"
                        height={18}
                        src={`https://flagcdn.com/32x24/${code}.png`}
                        width={24}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-ink-4">
                    {t(`languageLevels.${levelKey}`)}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <Separator />

          <AnimatedSection delay={0.2}>
            <Eyebrow className="mb-6">{t("sections.achievements")}</Eyebrow>
            <ul className="space-y-5">
              {achievementKeys.map((key) => (
                <li key={key} className="flex flex-col gap-0.5">
                  <span className="text-xs text-ink-4">
                    {tAchievements(`${key}.date`)}
                  </span>
                  <span className="text-sm leading-snug text-ink-2">
                    {tAchievements(`${key}.label`)}
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
