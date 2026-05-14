import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project } from "@/types/project";

const projectsDir = path.join(process.cwd(), "src/content/projects");

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(projectsDir, filename), "utf8");
      const { data } = matter(raw);
      return { slug, ...data } as Project;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getProjectBySlug(slug: string): Project & { content: string } {
  const filepath = path.join(projectsDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  return { slug, ...data, content } as Project & { content: string };
}
