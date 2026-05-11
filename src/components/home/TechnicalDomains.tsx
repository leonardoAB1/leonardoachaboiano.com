import type { ReactElement } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Eyebrow,
  Heading,
  Text,
} from "@/components/ui";

const domains = [
  {
    title: "Robotics software",
    description:
      "Control, perception, system integration, and behavior design for machines that need to operate under real constraints.",
  },
  {
    title: "Embedded systems",
    description:
      "Firmware, sensing, actuation, and low-level interfaces where timing, reliability, and observability matter.",
  },
  {
    title: "Hardware integration",
    description:
      "Mechanical, electrical, and software decisions treated as one engineering system rather than isolated layers.",
  },
] as const;

export function TechnicalDomains(): ReactElement {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Eyebrow>Technical domains</Eyebrow>
        <Heading>Systems thinking across the stack.</Heading>
        <Text>
          The work is strongest at boundaries: where abstract algorithms meet
          sensors, actuators, constraints, tolerances, and production realities.
        </Text>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {domains.map((domain) => (
          <Card key={domain.title}>
            <CardHeader>
              <CardTitle>{domain.title}</CardTitle>
              <CardDescription>{domain.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
