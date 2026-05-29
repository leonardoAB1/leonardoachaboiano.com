import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering projects spanning robotics, embedded systems, and hardware-software integration.",
};

export default function ProjectsPage(): ReactElement {
  const projects = getAllProjects();

  return (
    <Section as="main">
      <Container>
        <div className="mb-12 space-y-4">
          <Eyebrow>Portfolio</Eyebrow>
          <Heading as="h1" size="lg">
            Engineering projects
          </Heading>
          <Text>
            A selection of robotics, embedded, and hardware-software projects
            built across research labs, startups, and personal exploration.
          </Text>
        </div>

        <ProjectFilter projects={projects} />
      </Container>
    </Section>
  );
}
