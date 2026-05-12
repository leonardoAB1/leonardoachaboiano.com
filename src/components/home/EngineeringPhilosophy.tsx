import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Separator } from "@/components/ui/Separator";
import { Heading, Text } from "@/components/ui/Typography";

export function EngineeringPhilosophy(): ReactElement {
  return (
    <Section className="border-t border-border-subtle bg-surface-1/50 dark:bg-surface-1/30">
      <Container>
        <AnimatedSection className="flex flex-col gap-8">
          <Heading as="h2" size="md">
            Engineering philosophy
          </Heading>
          <div className="flex max-w-2xl flex-col gap-6">
            <Text className="text-ink-2" size="md">
              There are several proper ways to solve any engineering problem. A
              proper solution is one considered from every relevant point of
              view: in accordance with established standards, procedures, and
              the specifications of the project. The engineer&apos;s role,
              unlike the scientist&apos;s, is to identify and deliver that
              solution.
            </Text>
            <Text className="text-ink-2" size="md">
              Proper means technically sound, but also manufacturable, safe,
              maintainable, and reproducible. Standards and procedures are not
              bureaucracy: they are accumulated knowledge about how solutions
              fail in the real world. Meeting them is the work.
            </Text>
          </div>
          <Separator className="max-w-2xl" />
        </AnimatedSection>
      </Container>
    </Section>
  );
}
