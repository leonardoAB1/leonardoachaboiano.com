"use client";

import { m, type Variants } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

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

export function ProjectsGrid(): ReactElement {
  const t = useTranslations("Projects");

  return (
    <m.ul
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={gridContainer}
    >
      {projects.map((project) => {
        const title = t(`${project.id}.title`);
        return (
          <m.li
            key={project.id}
            className="group"
            variants={cardItem}
            whileHover={{
              y: -4,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
          >
            <Card className="flex h-full flex-col shadow-none hover:border-brand/20 hover:shadow-sm dark:shadow-none overflow-hidden">
              <div className="relative aspect-video w-full overflow-hidden bg-surface-1">
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
                  {t(`${project.id}.description`)}
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
          </m.li>
        );
      })}
    </m.ul>
  );
}
