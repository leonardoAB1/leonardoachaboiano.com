import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Heading, Text } from "@/components/ui/Typography";

export function EngineeringPhilosophy(): ReactElement {
  return (
    <Section className="bg-surface-brand">
      <Container>
        <AnimatedSection className="flex flex-col gap-8">
          <Heading as="h2" size="md">
            Engineering philosophy
          </Heading>
          <div className="flex max-w-2xl flex-col gap-6">
            <Text className="text-ink-2" size="md">
              {"There are several "}
              <span className="font-medium text-brand">proper</span>
              {" ways to solve any engineering problem. A "}
              <span className="font-medium text-brand">proper</span>
              {" solution is one considered from every relevant" +
                " point of view: in accordance with established" +
                " standards, procedures, and the specifications of" +
                " the project. The engineer's role, unlike the" +
                " scientist's, is to identify and deliver that solution."}
            </Text>
            <Text className="text-ink-2" size="md">
              <span className="font-medium text-brand">Proper</span>
              {" means technically sound, but also manufacturable," +
                " safe, maintainable, and reproducible. Standards and" +
                " procedures are not bureaucracy: they are accumulated" +
                " knowledge about how solutions fail in the real world." +
                " Meeting them is the work."}
            </Text>
          </div>
          <p className="max-w-2xl text-sm italic text-ink-3">
            {"“Proper” is one of my favorite words in English." +
              " Every time I face a new challenge, I find myself asking" +
              " the same question: what are the "}
            <span className="font-medium text-brand">proper</span>
            {" ways to approach this?"}
          </p>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
