import type { ReactElement } from "react";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps): ReactElement {
  if (projects.length === 0) {
    return (
      <p className="py-12 text-center text-ink-3">
        No projects match the selected filter.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug} className="flex">
          <div className="flex w-full">
            <ProjectCard project={project} />
          </div>
        </li>
      ))}
    </ul>
  );
}
