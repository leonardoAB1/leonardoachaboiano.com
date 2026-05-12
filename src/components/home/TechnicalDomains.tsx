import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Heading } from "@/components/ui/Typography";

interface TechnicalDomain {
  description: string;
  title: string;
}

const domains: TechnicalDomain[] = [
  {
    title: "Robotics software",
    description:
      "ROS-aware architectures, tooling for simulation and bring-up, and disciplined interfaces between perception, planning, and actuation.",
  },
  {
    title: "Embedded systems",
    description:
      "Firmware and drivers on resource-constrained hardware with attention to timing, safety, and long-term maintainability.",
  },
  {
    title: "Hardware & integration",
    description:
      "Sensors, actuators, and electronics brought together with mechanical reality: tolerance, routing, EMI, and service access.",
  },
  {
    title: "Manufacturing & DFM",
    description:
      "Parts and assemblies designed for fabrication, assembly, and test, with clear drawings, revision control, and supplier feedback loops.",
  },
];

export function TechnicalDomains(): ReactElement {
  return (
    <Section>
      <Container>
        <AnimatedSection className="flex flex-col gap-10">
          <Heading as="h2" size="md">
            Technical domains
          </Heading>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain) => (
              <li key={domain.title}>
                <Card className="h-full shadow-none dark:shadow-none">
                  <CardHeader>
                    <CardTitle>{domain.title}</CardTitle>
                    <CardDescription>{domain.description}</CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
