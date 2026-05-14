import Link from "next/link";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps): ReactElement {
  const { slug, frontmatter, readingTime } = post;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-ink-3">
          <span>
            {new Date(frontmatter.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{readingTime}</span>
        </div>
        <CardTitle>
          <Link
            href={`/blog/${slug}`}
            className="hover:text-brand transition-colors"
          >
            {frontmatter.title}
          </Link>
        </CardTitle>
        <CardDescription>{frontmatter.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
