import type { ReactElement } from "react";
import { Eyebrow, Heading, Text } from "@/components/ui";

const events = [
  {
    label: "Engineering foundation",
    detail:
      "Mechatronics and robotics training across mechanical, electrical, and software systems.",
  },
  {
    label: "Applied systems work",
    detail:
      "Experience integrating software with real hardware, test constraints, and manufacturing decisions.",
  },
  {
    label: "Public technical record",
    detail:
      "A growing portfolio of projects, notes, and media for engineering collaborators and recruiters.",
  },
] as const;

export function Timeline(): ReactElement {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Eyebrow>Trajectory</Eyebrow>
        <Heading>
          International, interdisciplinary, and implementation-focused.
        </Heading>
        <Text>
          The full CV page will expand this into education, experience,
          technical skills, languages, and downloadable resume material.
        </Text>
      </div>

      <ol className="grid gap-4 md:grid-cols-3">
        {events.map((event, index) => (
          <li
            key={event.label}
            className="rounded-2xl border border-border bg-surface-0 p-6"
          >
            <span className="text-sm font-semibold text-brand">
              0{index + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink-1">
              {event.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-3">{event.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
