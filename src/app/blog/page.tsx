import type { ReactElement } from "react";
import { Suspense } from "react";
import { PostList } from "@/components/blog/PostList";
import { TagFilter } from "@/components/blog/TagFilter";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description:
    "Technical writing on robotics, embedded systems, hardware-software integration, and engineering lessons from the field.",
};

export default function BlogPage(): ReactElement {
  const posts = getAllPosts();
  const allTags = [...new Set(posts.flatMap((p) => p.frontmatter.tags))].sort();

  return (
    <Section as="div">
      <Container>
        <div className="mb-12 space-y-4">
          <Eyebrow>Notes & Writing</Eyebrow>
          <Heading as="h1" size="xl">
            Blog
          </Heading>
          <Text>
            Technical notes on robotics, embedded systems, and engineering
            lessons from real projects.
          </Text>
        </div>
        <Suspense fallback={null}>
          <TagFilter tags={allTags} />
        </Suspense>
        <Suspense fallback={null}>
          <PostList posts={posts} />
        </Suspense>
      </Container>
    </Section>
  );
}
