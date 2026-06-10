"use client";

import { animate, m, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { SkillGrid } from "@/components/cv/SkillMarquee";
import { TimelineEntry } from "@/components/cv/TimelineEntry";
import { GlobePlaceholder } from "@/components/home/GlobePlaceholder";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Separator } from "@/components/ui/Separator";
import { Eyebrow } from "@/components/ui/Typography";
import { skillGroups } from "@/data/skills";
import { timelineEntries } from "@/data/timeline";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { resolveTimelineEntry } from "@/lib/timeline-content";
import { cn } from "@/lib/utils";

const GlobeVisualization = dynamic(
  () =>
    import("@/components/home/GlobeVisualization").then(
      (mod) => mod.GlobeVisualization,
    ),
  { ssr: false, loading: () => <GlobePlaceholder /> },
);

const achievementKeys = [
  "icpc",
  "diplomaHonour2",
  "cswa",
  "diplomaHonour1",
  "scholarship3",
  "scholarship2",
  "scholarship1",
  "diplomaHonour0",
  "rotary",
] as const;

const languages = [
  { nameKey: "spanish", levelKey: "native", countries: ["bo", "ar"] },
  { nameKey: "english", levelKey: "fluent", countries: ["us"] },
  { nameKey: "german", levelKey: "a2", countries: ["de", "ch"] },
  { nameKey: "italian", levelKey: "a2", countries: ["it"] },
] as const;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

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
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const t = useTranslations("CV");
  const tTimeline = useTranslations("Timeline");
  const tAchievements = useTranslations("Achievements");
  const locale = useLocale();

  // The globe is desktop-only (lg breakpoint, 1024px - same threshold as the
  // texture preload media query). Gating the React tree, not just the CSS,
  // means mobile never downloads or executes the three.js bundle at all.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Build the flat skill list with locale-aware labels.
  // Most skills are proper nouns that don't need translation;
  // only "Industrial Instrumentation" has a locale-specific name.
  const allLabeledSkills = skillGroups.flatMap(({ skills }) =>
    skills.map((key) => ({
      key,
      label:
        key === "Industrial Instrumentation"
          ? t("skillLabels.industrialInstrumentation")
          : key,
    })),
  );

  // All entries resolved once - same set as the hero, no cvVisible filtering.
  // Each carries its original array index so clicks map to the correct globe
  // marker.
  const allEntries = timelineEntries.map((e, i) => ({
    ...resolveTimelineEntry(e, tTimeline, locale),
    originalIndex: i,
  }));

  // Start downloading the globe bundle and its heavy deps as soon as we know
  // the viewport is desktop, so they are in the browser cache when
  // GlobeVisualization renders. Mobile skips the download entirely.
  useEffect(() => {
    if (!isDesktop) return;
    void import("@/components/home/GlobeVisualization");
    void import("three");
    void import("three-globe");
  }, [isDesktop]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const el = itemRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const target =
      window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
    animate(window.scrollY, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => window.scrollTo(0, v),
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[1fr_22rem] lg:gap-x-12">
        {/* Left column: career history */}
        <div className="space-y-10">
          {/* Career History - all entries, interactive, linked to the globe */}
          <AnimatedSection>
            <Eyebrow className="mb-6">{t("sections.careerHistory")}</Eyebrow>
            <div>
              {allEntries.map((entry, idx) => {
                const isActive = selectedIndex === entry.originalIndex;
                const isLast = idx === allEntries.length - 1;
                return (
                  <button
                    key={entry.id}
                    ref={(el) => {
                      itemRefs.current[entry.originalIndex] = el;
                    }}
                    type="button"
                    onClick={() => handleSelect(entry.originalIndex)}
                    className={cn(
                      "w-full text-start transition-opacity duration-200",
                      !isActive && "opacity-50 hover:opacity-80",
                    )}
                    aria-pressed={isActive}
                  >
                    <TimelineEntry
                      dateRange={entry.dateRange}
                      role={entry.role}
                      org={entry.org}
                      website={entry.website}
                      orgSubtitle={entry.orgSubtitle}
                      orgSubtitleWebsite={entry.orgSubtitleWebsite}
                      location={entry.location}
                      bullets={entry.bullets}
                      note={entry.note}
                      isActive={isActive}
                      isLast={isLast}
                    />
                  </button>
                );
              })}
            </div>
          </AnimatedSection>

          <Separator />
        </div>

        {/* Right column: globe (desktop only) + languages/achievements panel */}
        <div className="lg:sticky lg:top-14 lg:self-start lg:flex lg:flex-col lg:h-[calc(100svh-3.5rem)]">
          {/* Globe: desktop only - hidden on mobile */}
          <m.div
            className="hidden overflow-hidden rounded-2xl lg:block lg:aspect-square lg:w-full lg:flex-shrink-0"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={globeSlide}
          >
            {isDesktop ? (
              <GlobeVisualization
                activeIndex={selectedIndex}
                activeLabel={allEntries[selectedIndex].location}
                onSelectIndex={handleSelect}
              />
            ) : (
              // Cheap stand-in: CSS-hidden on mobile, and on desktop it covers
              // the single frame before the media query effect flips isDesktop.
              <GlobePlaceholder />
            )}
          </m.div>

          {/* Languages and Achievements panel - scrollable on desktop */}
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

      {/* Skills grid - all skills flat, no category labels, hover reveals name */}
      <AnimatedSection delay={0.05} className="mt-10">
        <Eyebrow className="mb-8 px-6 sm:px-8">{t("sections.skills")}</Eyebrow>
        <SkillGrid skills={allLabeledSkills} />
      </AnimatedSection>
    </>
  );
}
