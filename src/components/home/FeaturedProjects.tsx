import Link from "next/link";
import type { ReactElement } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Eyebrow,
  Heading,
  Text,
} from "@/components/ui";

const projects = [
  {
    title: "Autonomous robotics platform",
    description:
      "A placeholder case study for robot behavior, sensing, and control architecture.",
    tags: ["Robotics", "Control", "Integration"],
  },
  {
    title: "Embedded sensing module",
    description:
      "A placeholder case study for firmware, data acquisition, and hardware validation.",
    tags: ["Embedded", "Firmware", "Testing"],
  },
  {
    title: "Manufacturing-aware mechanism",
    description:
      "A placeholder case study for mechanical design, DFM, and iterative prototyping.",
    tags: ["DFM", "CAD", "Prototyping"],
  },
] as const;

export function FeaturedProjects(): ReactElement {
  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="space-y-4">
          <Eyebrow>Selected work</Eyebrow>
          <Heading>Projects will become detailed engineering records.</Heading>
          <Text>
            Each project page will emphasize constraints, architecture,
            tradeoffs, and lessons learned rather than only final visuals.
          </Text>
        </div>
        <Link
          href="/projects"
          className="text-sm font-medium text-brand transition-colors hover:text-brand-dim"
        >
          View all projects
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
