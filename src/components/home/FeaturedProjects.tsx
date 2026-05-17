"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
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
  image: string;
  tags: string[];
  description: string;
  href: string;
}

const projects: Project[] = [
  {
    title: "Differential Drive Robot",
    image: "/images/projects/differential-robot.jpg",
    tags: ["KiCad", "Python", "SolidWorks", "DFMA"],
    description:
      "Mobile robot with custom PCB, 3D-printed DFMA parts, and closed-loop motor control achieving 5% error margin",
    href: "/projects",
  },
  {
    title: "Micro Quadruped Robot",
    image: "/images/projects/micro-quadruped.jpg",
    tags: ["SolidWorks", "MATLAB", "3D Printing"],
    description:
      "Affordable quadruped with full kinematic analysis in MATLAB and SolidWorks, validated through simulation and physical testing",
    href: "/projects",
  },
  {
    title: "Smoke Detector Camera",
    image: "/images/projects/smoke-detector-camera.jpg",
    tags: ["ESP32", "C", "ESP-IDF", "SolidWorks"],
    description:
      "IoT smoke detection device integrating ESP32CAM, C firmware on ESP-IDF, and SolidWorks-designed housing for remote monitoring",
    href: "/projects",
  },
  {
    title: "Propeller Levitated Arm",
    image: "/images/projects/propeller-arm.jpg",
    tags: ["SolidWorks", "Arduino", "MATLAB", "IMU"],
    description:
      "Dual-propeller levitation rig with IMU feedback and MATLAB-validated control algorithm, complex parts manufactured via 3D printing",
    href: "/projects",
  },
  {
    title: "Hot Plate for SMD Soldering",
    image: "/images/projects/hot-plate.jpg",
    tags: ["Arduino", "MATLAB", "PCB", "Control"],
    description:
      "SMD reflow hot plate with MATLAB-designed temperature controller, capable of tracking a reflow curve or holding a setpoint",
    href: "/projects",
  },
  {
    title: "Can Crusher System",
    image: "/images/projects/can-crusher.jpg",
    tags: ["SolidWorks", "Fluidsim", "Electropneumatics"],
    description:
      "Automatic can crusher with electropneumatic control circuits designed in Fluidsim and mechanism modeled in SolidWorks",
    href: "/projects",
  },
  {
    title: "Portable Battery Trolley",
    image: "/images/projects/battery-trolley.jpg",
    tags: ["SolidWorks", "Stress Analysis", "Welding"],
    description:
      "Field-tested trolley under 20 kg carrying 200-250 kg of batteries, stress-simulated in SolidWorks and taken to production by Swiss Contact",
    href: "/projects",
  },
  {
    title: "Analog Temperature Alarm",
    image: "/images/projects/temperature-alarm.jpg",
    tags: ["Proteus", "PCB", "CNC", "Analog"],
    description:
      "Analog buzzer alarm circuit simulated in Proteus, validated on breadboard, and manufactured on a CNC-milled PCB",
    href: "/projects",
  },
  {
    title: "Coronavirus Data App",
    image: "/images/projects/covid-app.jpg",
    tags: ["Python", "Tkinter", "pandas", "matplotlib"],
    description:
      "GUI app to query, visualize, and compare COVID-19 data across countries using public APIs and standard Python data libraries",
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
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
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
