export type ProjectStatus = "completed" | "in-progress" | "archived";

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  status: ProjectStatus;
  technologies: string[];
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  challenges?: string[];
  lessons?: string[];
  publishedAt: string;
}
