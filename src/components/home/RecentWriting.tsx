"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Heading } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

interface Post {
  date: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
}

const posts: Post[] = [
  {
    date: "2025-04-10",
    title: "Getting Started with ROS2 Action Servers",
    description:
      "Building concurrent robotic behaviors with the ROS2 action server pattern",
    tags: ["ROS2", "Robotics"],
    href: "/blog",
  },
  {
    date: "2025-03-22",
    title: "PCB Design for Reliability Testing",
    description:
      "Lessons from designing measurement PCBs for photonic component characterization",
    tags: ["PCB", "Hardware"],
    href: "/blog",
  },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const headingVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const gridContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const viewport = { margin: "-80px", once: true } as const;

export function RecentWriting(): ReactElement {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={headingVariant}
          >
            <Heading as="h2" size="md">
              Recent writing
            </Heading>
          </motion.div>
          <motion.ul
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={gridContainer}
          >
            {posts.map((post) => (
              <motion.li
                key={post.title}
                variants={cardItem}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
              >
                <Card className="flex h-full flex-col shadow-none hover:border-brand/20 hover:shadow-sm dark:shadow-none">
                  <CardHeader>
                    <p className="text-xs text-ink-4">
                      {formatDate(post.date)}
                    </p>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-col gap-4 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} tone="neutral">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      href={post.href}
                      className="text-sm font-medium text-brand hover:text-brand-dim transition-colors duration-200"
                    >
                      Read post &rarr;
                    </Link>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            className="flex justify-center"
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={headingVariant}
          >
            <Link
              href="/blog"
              className={cn(buttonClasses({ variant: "secondary" }))}
            >
              Read all posts
            </Link>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
