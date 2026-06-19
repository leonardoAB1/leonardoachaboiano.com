import Link from "next/link";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { Project, ProjectStatus } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

function statusLabel(status: ProjectStatus): string {
  switch (status) {
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "archived":
      return "Archived";
  }
}

export function ProjectCard({ project }: ProjectCardProps): ReactElement {
  const statusTone = project.status === "in-progress" ? "brand" : "neutral";
  const topTechs = project.technologies.slice(0, 3);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{project.title}</CardTitle>
          <Badge tone={statusTone} className="shrink-0">
            {statusLabel(project.status)}
          </Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {topTechs.map((tech) => (
            <Badge key={tech} tone="neutral">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className={buttonClasses({ variant: "secondary", size: "sm" })}
          >
            View project
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "ghost", size: "sm" })}
            >
              GitHub
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
