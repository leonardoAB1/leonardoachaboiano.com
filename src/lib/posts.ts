import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post } from "@/types/post";

const postsDir = path.join(process.cwd(), "src/content/posts");

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(postsDir, filename), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        frontmatter: data as Post["frontmatter"],
        content,
        readingTime: readingTime(content).text,
      };
    })
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime(),
    );
}

export function getPostBySlug(slug: string): Post {
  const filepath = path.join(postsDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    frontmatter: data as Post["frontmatter"],
    content,
    readingTime: readingTime(content).text,
  };
}
