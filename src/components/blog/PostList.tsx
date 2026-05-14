"use client";
import { useSearchParams } from "next/navigation";
import type { ReactElement } from "react";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types/post";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps): ReactElement {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");

  const filtered = selectedTag
    ? posts.filter((p) => p.frontmatter.tags.includes(selectedTag))
    : posts;

  if (filtered.length === 0) {
    return (
      <p className="mt-12 text-center text-ink-3">
        No posts found for tag &ldquo;{selectedTag}&rdquo;.
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-6">
      {filtered.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
