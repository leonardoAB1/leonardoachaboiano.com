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

interface Project {
  title: string;
  tags: string[];
  description: string;
  href: string;
}

const projects: Project[] = [
  {
    title: "ROS2 Robotic Arm Control",
    tags: ["ROS2", "Python", "Embedded"],
    description:
      "Real-time control system for a 6-DOF arm with concurrent action servers",
    href: "/projects",
  },
  {
    title: "IoT Battery Management System",
    tags: ["MQTT", "CAN", "ESP32"],
    description:
      "MQTT/CAN-based IoT integration for electric motorcycle batteries",
    href: "/projects",
  },
  {
    title: "PCB Reliability Test Platform",
    tags: ["KiCad", "STM32", "Python"],
    description:
      "Automated measurement platform for photonic component characterization",
    href: "/projects",
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

export function FeaturedProjects(): ReactElement {
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
              Featured projects
            </Heading>
          </motion.div>
          <motion.ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={gridContainer}
          >
            {projects.map((project) => (
              <motion.li
                key={project.title}
                variants={cardItem}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
              >
                <Card className="flex h-full flex-col shadow-none hover:border-brand/20 hover:shadow-sm dark:shadow-none">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-col gap-4 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} tone="neutral">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      href={project.href}
                      className="text-sm font-medium text-brand hover:text-brand-dim transition-colors duration-200"
                    >
                      View project &rarr;
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
              href="/projects"
              className={cn(buttonClasses({ variant: "secondary" }))}
            >
              View all projects
            </Link>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
