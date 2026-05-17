import Link from "next/link";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { buttonClasses } from "@/components/ui/Button";
import { Heading, Text } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

export function ContactCTA(): ReactElement {
  return (
    <Section className="bg-surface-brand">
      <Container>
        <AnimatedSection>
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex flex-col gap-4">
              <Heading as="h2" size="lg" className="mx-auto">
                Let&apos;s build something meaningful.
              </Heading>
              <Text size="lg" className="mx-auto text-ink-2">
                Open to robotics engineering roles, embedded systems projects,
                and research collaborations.
              </Text>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className={cn(
                  buttonClasses({ variant: "primary", size: "lg" }),
                  "text-center",
                )}
              >
                Get in touch
              </Link>
              <Link
                href="/cv"
                className={cn(
                  buttonClasses({ variant: "secondary", size: "lg" }),
                  "text-center",
                )}
              >
                View CV
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
