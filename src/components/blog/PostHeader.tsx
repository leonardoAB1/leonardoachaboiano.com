import type { ReactElement } from "react";
import { Badge } from "@/components/ui/Badge";
import type { Post } from "@/types/post";

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps): ReactElement {
  const { frontmatter, readingTime } = post;
  return (
    <header className="mb-12 space-y-6 border-b border-border pb-10">
      <div className="flex flex-wrap gap-2">
        {frontmatter.tags.map((tag) => (
          <Badge key={tag} tone="brand">
            {tag}
          </Badge>
        ))}
      </div>
      <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink-1 sm:text-4xl sm:leading-tight">
        {frontmatter.title}
      </h1>
      <p className="text-lg leading-8 text-ink-3">{frontmatter.description}</p>
      <div className="flex items-center gap-3 text-sm text-ink-3">
        <time dateTime={frontmatter.publishedAt}>
          {new Date(frontmatter.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {frontmatter.updatedAt && (
          <>
            <span>·</span>
            <span>
              Updated{" "}
              {new Date(frontmatter.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </>
        )}
        <span>·</span>
        <span>{readingTime}</span>
      </div>
    </header>
  );
}
