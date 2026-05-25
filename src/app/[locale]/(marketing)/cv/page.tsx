import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactElement } from "react";
import { DownloadButton } from "@/components/cv/DownloadButton";
import { SkillBadge } from "@/components/cv/SkillBadge";
import { TimelineEntry } from "@/components/cv/TimelineEntry";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Separator } from "@/components/ui/Separator";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { timelineEntries } from "@/data/timeline";
import type { Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { resolveTimelineEntry } from "@/lib/timeline-content";

// ---------------------------------------------------------------------------
// Non-translatable data. Category/achievement/language ids key into the CV and
// Achievements message namespaces; skill tokens and flag codes are not translated.
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CV" });
  return pageMetadata({
    locale,
    pathname: "/cv",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function CVPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("CV");
  const tCommon = await getTranslations("Common");
  const tTimeline = await getTranslations("Timeline");
  const tAchievements = await getTranslations("Achievements");

  const resolve = (id: string) =>
    resolveTimelineEntry(
      // biome-ignore lint/style/noNonNullAssertion: ids are sourced from timelineEntries
      timelineEntries.find((entry) => entry.id === id)!,
      tTimeline,
      locale,
    );

  const workExperience = timelineEntries
    .filter((e) => e.type === "work" && e.cvVisible !== false)
    .map((e) => resolve(e.id));

  const education = timelineEntries
    .filter((e) => e.type === "education" && e.cvVisible !== false)
    .map((e) => resolve(e.id));

  return (
    <div className="bg-surface-0">
      {/* Header */}
      <Section as="header" className="py-8 sm:py-12">
        <Container>
          <AnimatedSection>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow className="mb-3">{t("eyebrow")}</Eyebrow>
                <Heading as="h1" size="xl">
                  {siteConfig.name}
                </Heading>
                <Text size="lg" className="mt-2 max-w-none">
                  {tCommon("role")}
                </Text>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-3">
                  <span>{t("location")}</span>
                  <span aria-hidden="true" className="text-border">
                    |
                  </span>
                  <a
                    className="transition-colors hover:text-brand"
                    href={`mailto:${siteConfig.email}`}
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              <div className="shrink-0">
                <DownloadButton />
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* Two-column content */}
      <Section className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[1fr_17rem] lg:gap-x-16">
            {/* Left: main content */}
            <div className="space-y-10">
              {/* Work Experience */}
              <AnimatedSection>
                <Eyebrow className="mb-6">{t("sections.work")}</Eyebrow>
                <div>
                  {workExperience.map((entry) => (
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
              <AnimatedSection delay={0.05}>
                <Eyebrow className="mb-6">{t("sections.education")}</Eyebrow>
                <div>
                  {education.map((entry) => (
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
              <AnimatedSection delay={0.05}>
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

            {/* Right: sidebar */}
            <div className="space-y-10">
              {/* Languages */}
              <AnimatedSection delay={0.1}>
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

              {/* Achievements */}
              <AnimatedSection delay={0.15}>
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
        </Container>
      </Section>
    </div>
  );
}
