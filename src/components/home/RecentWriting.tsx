"use client";

import { m, type Variants } from "framer-motion";
import { useFormatter, useTranslations } from "next-intl";
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
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Non-translatable post data. id keys into the Posts namespace for title +
// description; date (ISO), tags and href stay here.
interface Post {
  id: string;
  date: string;
  tags: string[];
  href: string;
}

const posts: Post[] = [
  {
    id: "smdHotPlate",
    date: "2025-04-08",
    tags: ["Control Systems", "Arduino", "MATLAB"],
    href: "/blog",
  },
  {
    id: "quadrupedKinematics",
    date: "2025-02-14",
    tags: ["Robotics", "SolidWorks", "MATLAB"],
    href: "/blog",
  },
];

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
  const t = useTranslations("Home.RecentWriting");
  const tp = useTranslations("Posts");
  const format = useFormatter();

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-10">
          <m.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={headingVariant}
          >
            <Heading as="h2" size="md">
              {t("heading")}
            </Heading>
          </m.div>
          <m.ul
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={gridContainer}
          >
            {posts.map((post) => (
              <m.li
                key={post.id}
                variants={cardItem}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
              >
                <Card className="flex h-full flex-col shadow-none hover:border-brand/20 hover:shadow-sm dark:shadow-none">
                  <CardHeader>
                    <p className="text-xs text-ink-4">
                      {format.dateTime(new Date(post.date), {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <CardTitle>{tp(`${post.id}.title`)}</CardTitle>
                    <CardDescription>
                      {tp(`${post.id}.description`)}
                    </CardDescription>
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
                      {t("readPost")} &rarr;
                    </Link>
                  </CardContent>
                </Card>
              </m.li>
            ))}
          </m.ul>
          <m.div
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
              {t("readAll")}
            </Link>
          </m.div>
        </div>
      </Container>
    </Section>
  );
}
