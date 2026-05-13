import Link from "next/link";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

export function Hero(): ReactElement {
  return (
    <Section className="flex min-h-[calc(100svh-3.5rem)] flex-col justify-center pb-16 pt-8 sm:pb-20 sm:pt-10">
      <Container className="flex flex-col gap-8">
        <Eyebrow>Mechatronics engineer</Eyebrow>
        <Heading as="h1" className="max-w-4xl" size="xl">
          Proud generalist
        </Heading>
        <Text className="max-w-2xl text-ink-2" size="lg">
          I work across embedded systems, robotics integration, and design for
          manufacturing, from prototypes to production-ready installations.
        </Text>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            className={cn(
              buttonClasses({ size: "lg", variant: "primary" }),
              "text-center",
            )}
            href="/projects"
          >
            View projects
          </Link>
          <Link
            className={cn(
              buttonClasses({ size: "lg", variant: "secondary" }),
              "text-center",
            )}
            href="/cv"
          >
            View CV
          </Link>
        </div>
      </Container>
    </Section>
  );
}
