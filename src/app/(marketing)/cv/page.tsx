import type { Metadata } from "next";
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
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae of Leonardo Acha Boiano - mechatronics and robotics engineer with experience in ROS2, embedded systems, PCB design, and hardware-software integration.",
};

// ---------------------------------------------------------------------------
// Data derived from the single source of truth in @/data/timeline
// ---------------------------------------------------------------------------

const workExperience = timelineEntries.filter(
  (e) => e.type === "work" && e.cvVisible !== false,
);

const education = timelineEntries.filter(
  (e) => e.type === "education" && e.cvVisible !== false,
);

const skillGroups: { category: string; skills: string[] }[] = [
  {
    category: "Programming",
    skills: ["Python", "C/C++", "MATLAB", "Verilog/VHDL", "LaTeX"],
  },
  {
    category: "Embedded & Robotics",
    skills: [
      "STM32",
      "ESP32",
      "ROS2",
      "FreeRTOS",
      "BLE",
      "CAN",
      "I2C",
      "MQTT",
    ],
  },
  {
    category: "Electronics & PCB",
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
    category: "Mechanical Design",
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
    category: "Tools",
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

const achievements = [
  { label: "Champion, ICPC Regional Contest", date: "Aug 2024" },
  {
    label: "Diploma of Honour, 2nd place - Mechatronic Eng term 2-2023",
    date: "Apr 2024",
  },
  { label: "Certified SOLIDWORKS Associate (CSWA)", date: "Nov 2023" },
  {
    label: "Diploma of Honour, 2nd place - Mechatronic Eng term 1-2023",
    date: "Sep 2023",
  },
  { label: "Excellence Scholarship x3", date: "2021-2022" },
  { label: "Rotary Youth Exchange Ambassador to Canada", date: "2018-2019" },
];

const languages = [
  { name: "Spanish", level: "Native", countries: ["bo", "ar"] },
  { name: "English", level: "Fluent", countries: ["us"] },
  { name: "German", level: "A2", countries: ["de", "ch"] },
  { name: "Italian", level: "A2", countries: ["it"] },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CVPage(): ReactElement {
  return (
    <div className="bg-surface-0">
      {/* Header */}
      <Section as="header" className="py-8 sm:py-12">
        <Container>
          <AnimatedSection>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow className="mb-3">Curriculum Vitae</Eyebrow>
                <Heading as="h1" size="xl">
                  {siteConfig.name}
                </Heading>
                <Text size="lg" className="mt-2 max-w-none">
                  {siteConfig.title}
                </Text>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-3">
                  <span>Basel, Switzerland</span>
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
                <Eyebrow className="mb-6">Work Experience</Eyebrow>
                <div>
                  {workExperience.map((entry) => (
                    <TimelineEntry
                      key={`${entry.org}-${entry.dateRange}`}
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
                <Eyebrow className="mb-6">Education</Eyebrow>
                <div>
                  {education.map((entry) => (
                    <TimelineEntry
                      key={`${entry.org}-${entry.dateRange}`}
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
                <Eyebrow className="mb-6">Skills</Eyebrow>
                <div className="space-y-6">
                  {skillGroups.map(({ category, skills }) => (
                    <div
                      key={category}
                      className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr] sm:gap-8"
                    >
                      <p className="text-sm font-medium text-ink-2 sm:pt-1">
                        {category}
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
            <div className="space-y-10 lg:sticky lg:top-8 lg:self-start">
              {/* Languages */}
              <AnimatedSection delay={0.1}>
                <Eyebrow className="mb-6">Languages</Eyebrow>
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  {languages.map(({ name, level, countries }) => (
                    <div
                      key={name}
                      className="flex flex-col gap-1.5"
                      aria-label={name}
                    >
                      <div className="flex gap-1">
                        {countries.map((code) => (
                          <img
                            key={code}
                            alt=""
                            className="rounded-sm"
                            height={18}
                            src={`https://flagcdn.com/32x24/${code}.png`}
                            width={24}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-ink-4">{level}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <Separator />

              {/* Achievements */}
              <AnimatedSection delay={0.15}>
                <Eyebrow className="mb-6">Achievements</Eyebrow>
                <ul className="space-y-5">
                  {achievements.map(({ label, date }) => (
                    <li key={label} className="flex flex-col gap-0.5">
                      <span className="text-xs text-ink-4">{date}</span>
                      <span className="text-sm leading-snug text-ink-2">
                        {label}
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
