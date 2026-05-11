import Link from "next/link";
import type { ReactElement } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Eyebrow,
  Heading,
  Text,
} from "@/components/ui";

const notes = [
  {
    title: "Notes on robotics systems architecture",
    description:
      "Future writing on how to structure robotics software around observability, testing, and integration boundaries.",
  },
  {
    title: "Designing hardware with software in mind",
    description:
      "Future writing on the feedback loop between mechanical design, firmware constraints, and manufacturing choices.",
  },
] as const;

export function RecentWriting(): ReactElement {
  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="space-y-4">
          <Eyebrow>Writing</Eyebrow>
          <Heading>
            Technical notes will document the thinking behind the work.
          </Heading>
          <Text>
            The blog will use MDX for engineering notes, diagrams, equations,
            and code snippets once the content pipeline is added.
          </Text>
        </div>
        <Link
          href="/blog"
          className="text-sm font-medium text-brand transition-colors hover:text-brand-dim"
        >
          Visit blog
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {notes.map((note) => (
          <Card key={note.title}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
              <CardDescription>{note.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
