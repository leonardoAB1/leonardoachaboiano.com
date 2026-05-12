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
              Good engineering is integration under constraint:
              electromechanical systems only matter when software, hardware, and
              process stay aligned through validation, revision, and handover.
            </Text>
            <Text className="text-ink-2" size="md">
              I default to explicit interfaces, measurable requirements, and
              builds that teammates can operate without heroics. The goal is
              reliability in the field, not novelty in the deck.
            </Text>
          </div>
          <Separator className="max-w-2xl" />
        </AnimatedSection>
      </Container>
    </Section>
  );
}
