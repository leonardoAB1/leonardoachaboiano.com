import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import type { ProjectStatus } from "@/types/project";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = getAllProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
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

export default async function ProjectDetailPage({
  params,
}: PageProps): Promise<ReactElement> {
  const { slug } = await params;

  let project: ReturnType<typeof getProjectBySlug>;
  try {
    project = getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const statusTone = project.status === "in-progress" ? "brand" : "neutral";

  return (
    <Section as="main">
      <Container>
        {/* Back link */}
        <div className="mb-10">
          <Link
            href="/projects"
            className={buttonClasses({ variant: "ghost", size: "sm" })}
          >
            &larr; All projects
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 space-y-4 border-b border-border pb-10">
          <Eyebrow>Project</Eyebrow>
          <div className="flex flex-wrap items-start gap-4">
            <Heading as="h1" size="lg" className="flex-1">
              {project.title}
            </Heading>
            <Badge tone={statusTone}>{statusLabel(project.status)}</Badge>
          </div>
          <Text size="lg">{project.description}</Text>

          {/* Technology badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} tone="neutral">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Action links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "secondary", size: "sm" })}
              >
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "primary", size: "sm" })}
              >
                Live demo
              </a>
            )}
          </div>
        </div>

        {/* Main prose content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <div className="prose prose-neutral dark:prose-invert max-w-none text-ink-2 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink-1 [&_li]:text-ink-3 [&_p]:leading-7 [&_p]:text-ink-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
              {project.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static rendered content
                    <h2 key={i}>{line.replace("## ", "")}</h2>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static rendered content
                    <li key={i}>{line.replace("- ", "")}</li>
                  );
                }
                if (line.trim() === "") {
                  // biome-ignore lint/suspicious/noArrayIndexKey: static rendered content
                  return <br key={i} />;
                }
                // biome-ignore lint/suspicious/noArrayIndexKey: static rendered content
                return <p key={i}>{line}</p>;
              })}
            </div>
          </article>

          {/* Sidebar: challenges + lessons */}
          <aside className="space-y-8">
            {project.challenges && project.challenges.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface-1 p-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-ink-3">
                  Challenges
                </h2>
                <ul className="space-y-3">
                  {project.challenges.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-ink-2">
                      <span className="mt-1 shrink-0 text-brand">&#x25A0;</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.lessons && project.lessons.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface-1 p-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-ink-3">
                  Lessons learned
                </h2>
                <ul className="space-y-3">
                  {project.lessons.map((l) => (
                    <li key={l} className="flex gap-2 text-sm text-ink-2">
                      <span className="mt-1 shrink-0 text-brand">&#x25B6;</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-ink-3">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/projects?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full border border-border bg-surface-1 px-3 py-1 text-xs font-medium text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink-1"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
