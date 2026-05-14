import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Leonardo Acha Boiano is a mechatronics engineer from Bolivia, now working " +
    "in Switzerland on robotics and embedded systems. Learn about his engineering " +
    "philosophy, background, and interdisciplinary approach.",
};

interface Domain {
  title: string;
  description: string;
  tools: string[];
}

const domains: Domain[] = [
  {
    title: "Embedded Systems",
    description:
      "Real-time firmware for industrial and robotics applications, from bare-metal " +
      "register access to RTOS task scheduling.",
    tools: ["STM32", "ESP32", "FreeRTOS", "ROS2"],
  },
  {
    title: "Electronics & PCB",
    description:
      "Schematic capture to production-ready layout, with measurement and validation " +
      "routines written alongside the hardware.",
    tools: ["KiCad", "PCB design", "Circuit prototyping"],
  },
  {
    title: "Mechanical Design",
    description:
      "3D models and engineering drawings with DFMA and GD&T applied from the first " +
      "sketch: CNC, 3D printing, and supplier documentation.",
    tools: ["SolidWorks", "DFMA", "GD&T", "CNC"],
  },
  {
    title: "Software",
    description:
      "From low-level C drivers to Python analysis scripts and ROS2 action servers - " +
      "the software layer that makes hardware useful.",
    tools: ["Python", "C/C++", "MATLAB", "Git"],
  },
];

interface Language {
  name: string;
  level: string;
  note?: string;
}

const languages: Language[] = [
  { name: "Spanish", level: "Native", note: "Bolivia" },
  { name: "English", level: "Fluent", note: "C1+" },
  { name: "German", level: "Basic", note: "A2" },
  { name: "Italian", level: "Basic", note: "A2" },
];

export default function AboutPage(): ReactElement {
  return (
    <div className="bg-surface-0">
      {/* Section 1 - Hero / Introduction */}
      <Section className="pb-12 pt-16 sm:pb-16 sm:pt-24">
        <Container>
          <AnimatedSection delay={0} className="flex flex-col gap-6">
            <Eyebrow>About</Eyebrow>
            <Heading as="h1" size="xl" className="max-w-4xl">
              From Bolivia to Switzerland - building robots and reliable
              systems.
            </Heading>
            <Text size="lg" className="max-w-2xl text-ink-2">
              I am a mechatronics engineer working at the intersection of
              hardware, embedded software, and robotics. My work spans the full
              stack: from PCB layout and firmware to ROS2 integration and
              mechanical fixation design.
            </Text>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* Section 2 - Engineering Philosophy */}
      <Section>
        <Container>
          <AnimatedSection delay={0.1} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Eyebrow>Philosophy</Eyebrow>
              <Heading as="h2" size="lg" className="max-w-3xl">
                Engineering is about making things work - reliably, safely, and
                for real people.
              </Heading>
            </div>
            <div className="flex max-w-2xl flex-col gap-6">
              <Text size="md" className="text-ink-2">
                The real world is a hostile environment for engineered systems.
                Temperatures shift, connectors corrode, vibration loosens
                fasteners, and software encounters edge cases the designer never
                imagined. A system that works once in the lab is not an
                achievement - a system that works reliably in the field, across
                its full service life, is.
              </Text>
              <Text size="md" className="text-ink-2">
                Standards and procedures exist because previous generations of
                engineers have already paid the cost of ignoring them. Following
                IPC guidelines for PCB assembly or adhering to GD&T tolerancing
                conventions is not bureaucracy - it is accumulated knowledge
                encoded into practice. Meeting those requirements is the work,
                not an obstacle to the work.
              </Text>
              <Text size="md" className="text-ink-2">
                Cross-disciplinary thinking is not a luxury but a necessity in
                mechatronics. A firmware engineer who understands PCB parasitics
                writes better interrupt handlers. A mechanical designer who
                understands firmware timing constraints makes better housing
                decisions. The depth of one discipline sharpens the judgment you
                apply to every other.
              </Text>
              <Text size="md" className="text-ink-2">
                Proper engineering means the solution is technically sound, but
                also manufacturable, safe, maintainable, and reproducible by
                someone other than the original author. Documentation,
                testability, and handoff quality are part of the deliverable -
                not an afterthought.
              </Text>
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* Section 3 - Background & Journey */}
      <Section className="bg-surface-1">
        <Container>
          <AnimatedSection delay={0.1} className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <Eyebrow>Background</Eyebrow>
              <Heading as="h2" size="lg">
                The path so far
              </Heading>
            </div>
            <div className="flex flex-col gap-0">
              {/* Timeline item 1 */}
              <div className="relative flex gap-6 pb-10">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-brand" />
                  <div className="mt-2 w-px flex-1 bg-border" />
                </div>
                <div className="flex flex-col gap-2 pb-2">
                  <p className="text-sm font-semibold text-ink-4">
                    2018 - 2019
                  </p>
                  <p className="font-medium text-ink-1">
                    Rotary Youth Exchange - Canada
                  </p>
                  <Text size="sm" className="text-ink-3">
                    Spent a year in Canada as a Rotary Youth Exchange
                    Ambassador, living with host families and attending a
                    Canadian high school. The experience reshaped how I think
                    about communication, adaptability, and what it means to
                    function effectively in an unfamiliar environment. It was my
                    first serious exposure to professional English and to a
                    culture of directness and independent problem-solving.
                  </Text>
                </div>
              </div>

              {/* Timeline item 2 */}
              <div className="relative flex gap-6 pb-10">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-brand" />
                  <div className="mt-2 w-px flex-1 bg-border" />
                </div>
                <div className="flex flex-col gap-2 pb-2">
                  <p className="text-sm font-semibold text-ink-4">
                    2020 - 2024
                  </p>
                  <p className="font-medium text-ink-1">
                    B.S. Mechatronics Engineering - Santa Cruz, Bolivia
                  </p>
                  <Text size="sm" className="text-ink-3">
                    Completed my degree at San Pablo Bolivian Catholic
                    University with a 3.7/4.0 GPA, graduating with honours. The
                    program was genuinely interdisciplinary: one semester
                    designing motor driver circuits in KiCad, the next writing
                    FreeRTOS firmware for them, and the one after modelling the
                    mechanical housing in SolidWorks. I served as President of
                    the Scientific Society in my final year, organising
                    workshops and connecting students with working engineers.
                  </Text>
                  <Text size="sm" className="text-ink-3">
                    During the degree I completed internships in Bolivia that
                    gave me early exposure to manufacturing environments,
                    industrial automation, and the gap between what is designed
                    and what is actually buildable.
                  </Text>
                </div>
              </div>

              {/* Timeline item 3 */}
              <div className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-brand" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-ink-4">
                    2024 - present
                  </p>
                  <p className="font-medium text-ink-1">
                    Robotics Engineer - Basel, Switzerland
                  </p>
                  <Text size="sm" className="text-ink-3">
                    Relocated to Switzerland to join cryoWrite AG as a Robotics
                    Engineer. Working on precision robotics systems where
                    hardware reliability and software correctness are equally
                    non-negotiable. The move was deliberate: I wanted to work in
                    an environment where engineering standards are high and the
                    culture of precision and accountability is embedded in daily
                    practice. So far, it has delivered exactly that.
                  </Text>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* Section 4 - Interdisciplinary Mindset */}
      <Section>
        <Container>
          <AnimatedSection delay={0.1} className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <Eyebrow>Approach</Eyebrow>
              <Heading as="h2" size="lg">
                Generalist by design
              </Heading>
              <Text size="md" className="text-ink-2">
                In mechatronics, the interfaces between disciplines are where
                most problems hide. Being fluent across domains is not a
                compromise - it is the point. I have designed the PCB and
                written the firmware for it. I have built the mechanical
                fixation and written the measurement software that runs on it. I
                understand the full stack from motor driver to ROS2 trajectory
                planner, and that context changes every decision.
              </Text>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {domains.map((domain) => (
                <div
                  key={domain.title}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-1 p-5"
                >
                  <p className="font-semibold text-ink-1">{domain.title}</p>
                  <p className="text-sm leading-6 text-ink-3">
                    {domain.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {domain.tools.map((tool) => (
                      <Badge key={tool} tone="neutral">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* Section 5 - Languages & International Experience */}
      <Section className="bg-surface-1">
        <Container>
          <AnimatedSection delay={0.1} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Eyebrow>Languages</Eyebrow>
              <Heading as="h2" size="md">
                Working in multiple languages and contexts
              </Heading>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex flex-col gap-1 rounded-xl border border-border bg-surface-0 p-4"
                >
                  <p className="font-semibold text-ink-1">{lang.name}</p>
                  <p className="text-sm text-brand">{lang.level}</p>
                  {lang.note && (
                    <p className="text-xs text-ink-4">{lang.note}</p>
                  )}
                </div>
              ))}
            </div>
            <Text size="sm" className="max-w-xl text-ink-3">
              The trajectory from Bolivia to Canada to Switzerland has not been
              accidental. I have sought out environments where the engineering
              bar is high and where working across language and cultural
              boundaries is normal. Each context has made me a more adaptable
              and precise communicator - which is, ultimately, a core
              engineering skill.
            </Text>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* Section 6 - Contact CTA */}
      <Section>
        <Container>
          <AnimatedSection delay={0.1} className="flex flex-col gap-6">
            <Heading as="h2" size="md" className="max-w-2xl">
              Working on something hard?
            </Heading>
            <Text size="md" className="max-w-xl text-ink-2">
              If you are working on hard engineering problems - robots, embedded
              systems, or hardware products - I would be glad to hear from you.
            </Text>
            <div>
              <Link
                href="/contact"
                className={cn(
                  buttonClasses({ variant: "primary", size: "lg" }),
                  "text-center",
                )}
              >
                Get in touch
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </Section>
    </div>
  );
}
