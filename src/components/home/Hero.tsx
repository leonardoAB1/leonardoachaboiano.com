"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  date: string;
  role: string;
  org: string;
  location: string;
  note?: string;
}

const entries: TimelineEntry[] = [
  {
    date: "Aug 2025 - Present",
    role: "Robotics Engineer",
    org: "cryoWrite AG",
    location: "Basel, Switzerland",
  },
  {
    date: "Feb - Jul 2025",
    role: "Robotics Intern",
    org: "cryoWrite AG",
    location: "Basel, Switzerland",
  },
  {
    date: "Aug 2024 - Jan 2025",
    role: "Reliability Testing & Hardware Design Intern",
    org: "Lumiphase AG",
    location: "Stafa, Switzerland",
  },
  {
    date: "Jun - Jul 2024",
    role: "Hardware Engineer",
    org: "Mobi Latam",
    location: "Santa Cruz, Bolivia",
  },
  {
    date: "Jan - Jun 2024",
    role: "Hardware Engineer Intern",
    org: "Mobi Latam",
    location: "Santa Cruz, Bolivia",
  },
  {
    date: "2020 - 2024",
    role: "B.S. Mechatronics Engineering",
    org: "San Pablo Catholic University",
    location: "Santa Cruz, Bolivia",
    note: "GPA 3.7/4 - Graduated with Honours",
  },
];

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

export function Hero(): ReactElement {
  return (
    <Section className="flex min-h-[calc(100svh-3.5rem)] flex-col justify-center pb-16 pt-8 sm:pb-20 sm:pt-10">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: hero copy */}
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
                I work across embedded systems, robotics integration, and design
                for manufacturing, from prototypes to production-ready
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

          {/* Right: career timeline */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={timelineContainer}
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border"
              />
              <ul className="flex flex-col gap-6">
                {entries.map((entry) => (
                  <motion.li
                    key={entry.date + entry.org}
                    variants={timelineItem}
                    className="relative flex gap-5 pl-8"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-[6px] h-3 w-3 rounded-full border-2 border-brand bg-surface-0"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-ink-4">{entry.date}</span>
                      <p className="text-sm font-semibold text-ink-1">
                        {entry.role}
                      </p>
                      <p className="text-xs text-ink-2">
                        {entry.org}&nbsp;&middot;&nbsp;{entry.location}
                      </p>
                      {entry.note && (
                        <p className="text-xs text-ink-3">{entry.note}</p>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
