import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { MDXContent } from "@/components/blog/MDXContent";
import { PostHeader } from "@/components/blog/PostHeader";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { compileMDX } from "@/lib/mdx";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Post } from "@/types/post";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    };
  } catch {
    return {};
  }
}

export default async function PostPage({
  params,
}: PageProps): Promise<ReactElement> {
  const { slug } = await params;

  let post: Post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  let MDXBody: React.ComponentType;
  try {
    MDXBody = await compileMDX(post.content);
  } catch {
    notFound();
  }

  // Extract h2/h3 headings from MDX content for table of contents
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];

  let match = headingRegex.exec(post.content);
  while (match !== null) {
    const raw = match[0];
    const text = match[1].trim();
    const level = raw.startsWith("###") ? 3 : 2;
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
    match = headingRegex.exec(post.content);
  }

  return (
    <Section as="div">
      <Container>
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-16">
          <div className="min-w-0">
            <PostHeader post={post} />
            <MDXContent>
              <MDXBody />
            </MDXContent>
          </div>
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>
      </Container>
    </Section>
  );
}
