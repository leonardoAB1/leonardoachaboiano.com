import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { VideoGrid } from "@/components/media/VideoGrid";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Engineering talks and tutorials on embedded systems, ROS2, PCB design, and robotics by Leonardo Acha Boiano.",
};

// placeholder video IDs - replace with real content when channel launches
const placeholderVideos = [
  {
    id: "dQw4w9WgXcQ",
    title: "Introduction to ROS2 Action Servers",
    description:
      "A walkthrough of building concurrent robotic behaviors using ROS2 action clients and servers.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "PCB Design for Reliability Testing",
    description:
      "How to design test PCBs that minimize contact resistance variation and improve measurement repeatability.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "STM32 FreeRTOS: Real-Time Embedded Systems",
    description:
      "Setting up FreeRTOS tasks, queues, and semaphores for deterministic embedded control.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "From Bolivia to Switzerland: Engineering Across Cultures",
    description:
      "Reflections on navigating international engineering environments and building cross-cultural technical teams.",
  },
];

export default function MediaPage(): ReactElement {
  return (
    <Section>
      <Container>
        <AnimatedSection>
          <div className="mb-12 space-y-4">
            <Eyebrow>Technical Content</Eyebrow>
            <Heading as="h1" size="lg">
              Engineering Talks &amp; Tutorials
            </Heading>
            <Text size="lg">
              I document the engineering problems I work on - from embedded
              systems and ROS2 to PCB design and robotics. These are early
              recordings; more content is coming as the channel grows.
            </Text>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <VideoGrid videos={placeholderVideos} />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mt-12 flex justify-center">
            <a
              href="https://www.youtube.com/@leonardoachaboiano"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              Subscribe on YouTube
            </a>
          </div>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
