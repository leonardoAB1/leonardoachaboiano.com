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
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae of Leonardo Acha Boiano - mechatronics and robotics engineer with experience in ROS2, embedded systems, PCB design, and hardware-software integration.",
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const workExperience = [
  {
    dateRange: "Aug 2025 - Present",
    role: "Robotics Engineer",
    org: "cryoWrite AG",
    location: "Basel-Stadt, Switzerland",
    bullets: [
      "Developing and maintaining ROS2 robotic systems with concurrent actions and hardware integration",
      "On-site system installation, servicing, and preventive maintenance for deployed client systems",
    ],
  },
  {
    dateRange: "Feb 2025 - Jul 2025",
    role: "Robotics Intern",
    org: "cryoWrite AG",
    location: "Basel, Switzerland",
    bullets: [
      "Spearheaded company-wide documentation strategy in Confluence for internal knowledge sharing",
    ],
  },
  {
    dateRange: "Aug 2024 - Jan 2025",
    role: "Reliability Testing & Hardware Design Intern",
    org: "Lumiphase AG",
    location: "Stafa, ZH, Switzerland",
    bullets: [
      "Implemented new test methods: instrument selection, integration, and measurement routine coding",
      "Designed PCBs for sample fixation and electrical routing",
      "Lab operations: instrument setup, hardware installation, calibration routine development",
    ],
  },
  {
    dateRange: "Jan 2024 - Jul 2024",
    role: "Hardware Engineer",
    org: "Mobi Latam",
    location: "Santa Cruz, Bolivia",
    bullets: [
      "Integrated MQTT and CAN-based IoT batteries into existing workflow via APIs",
      "Designed and prototyped solenoid actuators and control PCB for electric motorcycle battery security",
      "Product development and logistics coordination with Chinese business partners",
    ],
  },
  {
    dateRange: "Mar 2023 - May 2023",
    role: "Mechanical Design Intern",
    org: "Reality HC",
    location: "Santa Cruz, Bolivia",
  },
] as const;

const education = [
  {
    dateRange: "2020 - 2024",
    role: "B.S. Mechatronics Engineering",
    org: "San Pablo Bolivian Catholic University",
    location: "Santa Cruz, Bolivia",
    note: "GPA 3.7/4 - Graduated with Honours - President of the Scientific Society (2023-2024)",
  },
] as const;

const skillGroups: { category: string; skills: string[] }[] = [
  {
    category: "Programming",
    skills: ["Python", "C/C++", "MATLAB", "Verilog/VHDL", "LaTeX"],
  },
  {
    category: "Embedded & Robotics",
    skills: ["STM32", "ESP32", "ROS2", "FreeRTOS", "BLE", "CAN", "I2C", "MQTT"],
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
  { name: "Spanish", level: "Native" },
  { name: "English", level: "Fluent" },
  { name: "German", level: "A2" },
  { name: "Italian", level: "A2" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CVPage(): ReactElement {
  return (
    <div className="bg-surface-0">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Section as="header">
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
                    className="hover:text-brand transition-colors"
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

      {/* ------------------------------------------------------------------ */}
      {/* Work Experience                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Section>
        <Container>
          <AnimatedSection>
            <Eyebrow className="mb-6">Work Experience</Eyebrow>
            <div>
              {workExperience.map((entry) => (
                <TimelineEntry
                  key={`${entry.org}-${entry.dateRange}`}
                  {...entry}
                />
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* ------------------------------------------------------------------ */}
      {/* Education                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Section>
        <Container>
          <AnimatedSection delay={0.05}>
            <Eyebrow className="mb-6">Education</Eyebrow>
            <div>
              {education.map((entry) => (
                <TimelineEntry
                  key={`${entry.org}-${entry.dateRange}`}
                  {...entry}
                />
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* ------------------------------------------------------------------ */}
      {/* Skills                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Section>
        <Container>
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
        </Container>
      </Section>

      <Separator />

      {/* ------------------------------------------------------------------ */}
      {/* Achievements                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Section>
        <Container>
          <AnimatedSection delay={0.05}>
            <Eyebrow className="mb-6">Achievements</Eyebrow>
            <ul className="space-y-4">
              {achievements.map(({ label, date }) => (
                <li
                  key={label}
                  className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr] sm:gap-8"
                >
                  <span className="text-sm text-ink-4">{date}</span>
                  <span className="text-sm text-ink-2">{label}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* ------------------------------------------------------------------ */}
      {/* Languages                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Section>
        <Container>
          <AnimatedSection delay={0.05}>
            <Eyebrow className="mb-6">Languages</Eyebrow>
            <div className="flex flex-wrap gap-6">
              {languages.map(({ name, level }) => (
                <div key={name} className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-ink-1">{name}</span>
                  <span className="text-xs text-ink-4">{level}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </Section>
    </div>
  );
}
