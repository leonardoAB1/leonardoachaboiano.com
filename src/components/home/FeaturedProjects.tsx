"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Heading } from "@/components/ui/Typography";

// Non-translatable project data. id keys into the Projects message namespace for
// title + description; image, tags (proper-noun tech) stay here.
interface Project {
  id: string;
  image: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: "differentialDriveRobot",
    image: "/images/projects/differential-robot.jpg",
    tags: ["KiCad", "Python", "SolidWorks", "DFMA"],
  },
  {
    id: "microQuadruped",
    image: "/images/projects/micro-quadruped.jpg",
    tags: ["SolidWorks", "MATLAB", "3D Printing"],
  },
  {
    id: "smokeDetectorCamera",
    image: "/images/projects/smoke-detector-camera.jpg",
    tags: ["ESP32", "C", "ESP-IDF", "SolidWorks"],
  },
  {
    id: "propellerArm",
    image: "/images/projects/propeller-arm.jpg",
    tags: ["SolidWorks", "Arduino", "MATLAB", "IMU"],
  },
  {
    id: "hotPlate",
    image: "/images/projects/hot-plate.jpg",
    tags: ["Arduino", "MATLAB", "PCB", "Control"],
  },
  {
    id: "canCrusher",
    image: "/images/projects/can-crusher.jpg",
    tags: ["SolidWorks", "Fluidsim", "Electropneumatics"],
  },
  {
    id: "batteryTrolley",
    image: "/images/projects/battery-trolley.jpg",
    tags: ["SolidWorks", "Stress Analysis", "Welding"],
  },
  {
    id: "temperatureAlarm",
    image: "/images/projects/temperature-alarm.jpg",
    tags: ["Proteus", "PCB", "CNC", "Analog"],
  },
  {
    id: "covidApp",
    image: "/images/projects/covid-app.jpg",
    tags: ["Python", "Tkinter", "pandas", "matplotlib"],
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
  const t = useTranslations("Home.FeaturedProjects");
  const tp = useTranslations("Projects");

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
              {t("heading")}
            </Heading>
          </motion.div>
          <motion.ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={gridContainer}
          >
            {projects.map((project) => {
              const title = tp(`${project.id}.title`);
              return (
                <motion.li
                  key={project.id}
                  className="group"
                  variants={cardItem}
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                >
                  <Card className="flex h-full flex-col shadow-none hover:border-brand/20 hover:shadow-sm dark:shadow-none overflow-hidden">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <Image
                        src={project.image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{title}</CardTitle>
                      <CardDescription>
                        {tp(`${project.id}.description`)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} tone="neutral">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </Container>
    </Section>
  );
}
