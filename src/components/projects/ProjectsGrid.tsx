"use client";

import { m } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ReactElement, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  fadeSlideUpCard,
  staggerContainer,
  viewport,
} from "@/lib/motion-variants";
import { cn } from "@/lib/utils";

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

const allTags = [...new Set(projects.flatMap((p) => p.tags))];

export function ProjectsGrid(): ReactElement {
  const t = useTranslations("Projects");
  const [active, setActive] = useState<string | null>(null);

  const visible = active
    ? projects.filter((p) => p.tags.includes(active))
    : projects;

  return (
    <div>
      {/* Opacity-driven filter row - active tag at full opacity, others dimmed */}
      <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2">
        {["All", ...allTags].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag === "All" ? null : tag)}
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.24em] transition-opacity duration-200",
              (tag === "All" ? active === null : active === tag)
                ? "text-ink-1 opacity-100"
                : "text-ink-3 opacity-50 hover:opacity-75",
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <m.ul
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerContainer}
      >
        {visible.map((project) => {
          const title = t(`${project.id}.title`);
          return (
            <m.li
              key={project.id}
              className="group"
              variants={fadeSlideUpCard}
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
                  <p className="mt-1 text-xs tracking-wide text-ink-4">
                    {project.tags.join(" · ")}
                  </p>
                </CardHeader>
              </Card>
            </m.li>
          );
        })}
      </m.ul>
    </div>
  );
}
