import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
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
  "scholarship",
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

  const educationEntries = timelineEntries
    .filter((e) => e.cvVisible !== false && e.type === "education")
    .map((e) => resolveTimelineEntry(e, tTimeline, locale));

  const achievements = ACHIEVEMENT_KEYS.map((key) => ({
    label: tAchievements(`${key}.label`),
    date: tAchievements(`${key}.date`),
  }));

  const languages = LANGUAGE_KEYS.map(({ nameKey, levelKey }) => ({
    name: tCV(`languageNames.${nameKey}`),
    level: tCV(`languageLevels.${levelKey}`),
  }));

  const photoBuffer = await readFile(
    join(process.cwd(), "public", "images", "profile.jpg"),
  );
  const photoDataUrl = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;

  const buffer = await renderToBuffer(
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

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="CV_LEONARDO_ACHA_BOIANO.pdf"',
    },
  });
}
