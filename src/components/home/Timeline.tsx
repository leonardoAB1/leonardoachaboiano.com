import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { timelineEntries } from "@/data/timeline";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";

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
              {timelineEntries.map((entry, index) => (
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
