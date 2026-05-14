"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import { ProjectGrid } from "./ProjectGrid";

interface ProjectFilterProps {
  projects: Project[];
}

export function ProjectFilter({ projects }: ProjectFilterProps): ReactElement {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Collect all unique tags across every project, preserving insertion order
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  const filtered =
    selectedTag === null
      ? projects
      : projects.filter((p) => p.tags.includes(selectedTag));

  return (
    <div className="space-y-8">
      {/* Tag filter bar */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedTag(null)}
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150",
            selectedTag === null
              ? "border-brand/30 bg-surface-brand text-brand"
              : "border-border bg-surface-1 text-ink-2 hover:bg-surface-2 hover:text-ink-1",
          )}
        >
          All
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() =>
              setSelectedTag((prev) => (prev === tag ? null : tag))
            }
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150",
              selectedTag === tag
                ? "border-brand/30 bg-surface-brand text-brand"
                : "border-border bg-surface-1 text-ink-2 hover:bg-surface-2 hover:text-ink-1",
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <ProjectGrid projects={filtered} />
    </div>
  );
}
