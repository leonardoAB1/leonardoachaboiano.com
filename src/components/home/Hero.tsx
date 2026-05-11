import Link from "next/link";
import type { ReactElement } from "react";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { Badge, buttonClasses, Eyebrow, Heading, Text } from "@/components/ui";

export function Hero(): ReactElement {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
      <div className="space-y-8">
        <div className="space-y-5">
          <Eyebrow>Robotics and mechatronics engineering</Eyebrow>
          <Heading as="h1" size="xl">
            Building practical systems where software meets the physical world.
          </Heading>
          <Text size="lg">
            I work across robotics software, embedded systems, hardware/software
            integration, and manufacturing-minded engineering. This site
            collects the projects, notes, and technical direction behind that
            work.
          </Text>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/projects" className={buttonClasses({ size: "lg" })}>
            View projects
          </Link>
          <Link
            href="/cv"
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            Read CV
          </Link>
        </div>

        <SocialLinks />
      </div>

      <aside className="rounded-3xl border border-border bg-surface-1 p-6">
        <div className="space-y-5">
          <Badge tone="brand">Current focus</Badge>
          <p className="text-2xl font-semibold tracking-tight text-ink-1">
            Engineering interfaces between autonomy, hardware constraints, and
            reliable field behavior.
          </p>
          <p className="text-sm leading-6 text-ink-3">
            The portfolio is being built as a durable technical record: precise
            enough for engineering peers, accessible enough for collaborators,
            and structured enough to grow with new projects and writing.
          </p>
        </div>
      </aside>
    </div>
  );
}
