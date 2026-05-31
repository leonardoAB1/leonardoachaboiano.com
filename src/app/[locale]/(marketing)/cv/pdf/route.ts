import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { createElement } from "react";
import { CVDocument } from "@/components/cv/pdf/CVDocument";
import { hardSkills, softSkills } from "@/data/cv-pdf-skills";
import { timelineEntries } from "@/data/timeline";
import type { Locale } from "@/i18n/routing";
import { siteConfig, socialLinks } from "@/lib/constants";
import { resolveTimelineEntry } from "@/lib/timeline-content";

const ACHIEVEMENT_KEYS = [
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

const LANGUAGE_KEYS = [
  { nameKey: "spanish", levelKey: "native" },
  { nameKey: "english", levelKey: "fluent" },
  { nameKey: "german", levelKey: "a2" },
  { nameKey: "italian", levelKey: "a2" },
] as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;

  const [tTimeline, tCV, tAchievements] = await Promise.all([
    getTranslations({ locale: locale as Locale, namespace: "Timeline" }),
    getTranslations({ locale: locale as Locale, namespace: "CV" }),
    getTranslations({ locale: locale as Locale, namespace: "Achievements" }),
  ]);

  const workEntries = timelineEntries
    .filter((e) => e.cvVisible !== false && e.type === "work")
    .map((e) => resolveTimelineEntry(e, tTimeline, locale));

  // Education entries use year-only date ranges to match the original PDF format.
  const educationEntries = timelineEntries
    .filter((e) => e.cvVisible !== false && e.type === "education")
    .map((e) => {
      const resolved = resolveTimelineEntry(e, tTimeline, locale);
      const endYear =
        e.end === "present" ? new Date().getFullYear() : e.end.year;
      return { ...resolved, dateRange: `${e.start.year} - ${endYear}` };
    });

  const achievements = ACHIEVEMENT_KEYS.map((key) => ({
    label: tAchievements(`${key}.label`),
    date: tAchievements(`${key}.date`),
    description: tAchievements(`${key}.description`),
  }));

  const languages = LANGUAGE_KEYS.map(({ nameKey, levelKey }) => ({
    name: tCV(`languageNames.${nameKey}`),
    level: tCV(`languageLevels.${levelKey}`),
  }));

  const photoBuffer = await readFile(
    join(process.cwd(), "public", "images", "profile.jpg"),
  );
  const photoDataUrl = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;

  const pdfBuffer = await renderToBuffer(
    createElement(CVDocument, {
      name: siteConfig.name,
      title: siteConfig.title,
      email: siteConfig.email,
      phone: siteConfig.phone,
      location: tCV("location"),
      linkedin: socialLinks.linkedin,
      github: socialLinks.github,
      githubAlt: socialLinks.githubAlt,
      summary: tCV("summary"),
      workEntries,
      educationEntries,
      achievements,
      languages,
      hardSkills,
      softSkills,
      photoDataUrl,
    }),
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="CV_LEONARDO_ACHA_BOIANO.pdf"',
    },
  });
}
