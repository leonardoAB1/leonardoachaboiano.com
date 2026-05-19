import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { type TimelineEntryType, timelineEntries } from "@/data/timeline";

const TYPE_LABEL: Record<NonNullable<TimelineEntryType>, string> = {
  work: "Work",
  education: "Education",
  exchange: "Exchange",
};

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
                      <div className="flex items-center gap-2">
                        <Eyebrow as="span">{entry.date}</Eyebrow>
                        {entry.type && entry.type !== "work" && (
                          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ink-3">
                            {TYPE_LABEL[entry.type]}
                          </span>
                        )}
                      </div>
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
