import type { ReactElement } from "react";
import { ContactCTA } from "@/components/home/ContactCTA";
import { EngineeringPhilosophy } from "@/components/home/EngineeringPhilosophy";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { RecentWriting } from "@/components/home/RecentWriting";
import { TechnicalDomains } from "@/components/home/TechnicalDomains";
import { Timeline } from "@/components/home/Timeline";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Separator } from "@/components/ui";

export default function Home(): ReactElement {
  return (
    <>
      <Section className="pt-20 sm:pt-28">
        <Container>
          <AnimatedSection>
            <Hero />
          </AnimatedSection>
        </Container>
      </Section>

      <Container>
        <Separator />
      </Container>

      <Section>
        <Container>
          <AnimatedSection>
            <TechnicalDomains />
          </AnimatedSection>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <AnimatedSection>
            <EngineeringPhilosophy />
          </AnimatedSection>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <AnimatedSection>
            <FeaturedProjects />
          </AnimatedSection>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <AnimatedSection>
            <RecentWriting />
          </AnimatedSection>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <AnimatedSection>
            <Timeline />
          </AnimatedSection>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <AnimatedSection>
            <ContactCTA />
          </AnimatedSection>
        </Container>
      </Section>
    </>
  );
}
