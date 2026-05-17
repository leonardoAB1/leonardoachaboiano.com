"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Heading } from "@/components/ui/Typography";

interface TechnicalDomain {
  description: string;
  title: string;
}

const domains: TechnicalDomain[] = [
  {
    title: "Electromechanical systems",
    description:
      "Actuators, sensors, and electronics codesigned with mechanical structure: tolerance stack-ups, mounting, routing, and assembly considered from the first sketch.",
  },
  {
    title: "Embedded systems & firmware",
    description:
      "Firmware on STM32 and ESP32 with FreeRTOS, industrial protocols including CAN, I2C, and BLE, and control logic for real-time hardware operation.",
  },
  {
    title: "Electronics & PCB design",
    description:
      "Schematic capture, layout, and reliability testing using KiCad and Altium: from breadboard prototype to production-ready board with measurement and validation routines.",
  },
  {
    title: "Mechanical design & manufacturing",
    description:
      "3D models and drawings in SolidWorks and Fusion 360, with DFMA and GD&T applied from day one: CNC machining, 3D printing, and supplier-ready documentation.",
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
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const viewport = { margin: "-80px", once: true } as const;

export function TechnicalDomains(): ReactElement {
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
              Technical domains
            </Heading>
          </motion.div>
          <motion.ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={gridContainer}
          >
            {domains.map((domain) => (
              <motion.li
                key={domain.title}
                variants={cardItem}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
              >
                <Card className="h-full shadow-none hover:border-brand/20 hover:shadow-sm dark:shadow-none">
                  <CardHeader>
                    <CardTitle>{domain.title}</CardTitle>
                    <CardDescription>{domain.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </Section>
  );
}
