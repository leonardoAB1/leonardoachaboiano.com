import Link from "next/link";
import type { ReactElement } from "react";
import { buttonClasses, Eyebrow, Heading, Text } from "@/components/ui";

export function ContactCTA(): ReactElement {
  return (
    <div className="rounded-3xl border border-border bg-ink-1 p-8 text-surface-0 sm:p-10">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="space-y-4">
          <Eyebrow className="text-surface-brand">Contact</Eyebrow>
          <Heading className="text-surface-0">
            Interested in robotics, embedded systems, or technical
            collaboration?
          </Heading>
          <Text className="text-surface-2">
            Reach out for engineering roles, research conversations, project
            collaboration, or technical writing opportunities.
          </Text>
        </div>
        <Link
          href="/contact"
          className={buttonClasses({
            variant: "secondary",
            size: "lg",
            className: "shrink-0 bg-surface-0 text-ink-1 hover:bg-surface-2",
          })}
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
