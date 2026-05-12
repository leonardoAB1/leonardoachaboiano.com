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
    title: "Electromechanical systems",
    description:
      "Actuators, sensors, and electronics codesigned with mechanical structure: tolerance stack-ups, mounting, routing, and assembly considered from the first sketch.",
  },
  {
    title: "Embedded systems & firmware",
    description:
      "Firmware on STM32 and ESP32 with FreeRTOS, industrial protocols including CAN, I2C, and BLE, and control logic for real-time hardware operation.",
  },
  {
    title: "Electronics & PCB design",
    description:
      "Schematic capture, layout, and reliability testing using KiCad and Altium: from breadboard prototype to production-ready board with measurement and validation routines.",
  },
  {
    title: "Mechanical design & manufacturing",
    description:
      "3D models and drawings in SolidWorks and Fusion 360, with DFMA and GD&T applied from day one: CNC machining, 3D printing, and supplier-ready documentation.",
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
