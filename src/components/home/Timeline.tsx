import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";

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
    date: "Jan - Jul 2024",
    role: "Hardware Engineer",
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

export function Timeline(): ReactElement {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-10">
          <AnimatedSection>
            <Heading as="h2" size="md">
              Career timeline
            </Heading>
          </AnimatedSection>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border"
            />
            <ul className="flex flex-col gap-8">
              {entries.map((entry, index) => (
                <AnimatedSection
                  key={entry.date + entry.org}
                  delay={index * 0.07}
                >
                  <li className="relative flex gap-6 pl-8">
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-[6px] h-3.5 w-3.5 rounded-full border-2 border-brand bg-surface-0"
                    />
                    <div className="flex flex-col gap-0.5">
                      <Eyebrow as="span">{entry.date}</Eyebrow>
                      <p className="font-semibold text-ink-1">{entry.role}</p>
                      <Text size="sm" className="max-w-none text-ink-2">
                        {entry.org} &middot; {entry.location}
                      </Text>
                      {entry.note && (
                        <Text size="sm" className="max-w-none text-ink-3">
                          {entry.note}
                        </Text>
                      )}
                    </div>
                  </li>
                </AnimatedSection>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
