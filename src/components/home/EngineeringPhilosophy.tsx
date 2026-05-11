import type { ReactElement } from "react";
import { Eyebrow, Heading, Text } from "@/components/ui";

export function EngineeringPhilosophy(): ReactElement {
  return (
    <div className="grid gap-8 rounded-3xl border border-border bg-surface-1 p-8 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-4">
        <Eyebrow>Engineering philosophy</Eyebrow>
        <Heading as="h2" size="md">
          Useful systems are designed with evidence, constraints, and humility.
        </Heading>
      </div>
      <div className="space-y-5">
        <Text>
          I am drawn to engineering work that has to survive contact with the
          physical world: imperfect sensors, material limits, manufacturing
          tradeoffs, unclear requirements, and teams with different specialties.
        </Text>
        <Text>
          The goal is not novelty for its own sake. The goal is to build systems
          that can be understood, tested, maintained, and trusted by the people
          who depend on them.
        </Text>
      </div>
    </div>
  );
}
