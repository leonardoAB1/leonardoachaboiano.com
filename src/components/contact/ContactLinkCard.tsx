import { ArrowUpRight } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

export interface ContactLink {
  id: string;
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface ContactLinkCardProps {
  link: ContactLink;
}

export function ContactLinkCard({ link }: ContactLinkCardProps): ReactElement {
  const content = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center text-brand">
        {link.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium text-ink-1">
          {link.title}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-ink-3">
          {link.description}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 text-brand transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </>
  );
  const className =
    "group flex min-h-20 items-center gap-3 border border-brand/45 px-4 py-3 outline-offset-4 transition-colors hover:border-brand hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-brand";

  if (link.id === "email") {
    return (
      <a href={link.href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  );
}
