import Link from "next/link";
import type { ReactElement } from "react";
import { socialLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  className?: string;
}

const links = [
  { label: "GitHub", href: socialLinks.github },
  { label: "LinkedIn", href: socialLinks.linkedin },
  { label: "Email", href: socialLinks.email },
] as const;

export function SocialLinks({ className }: SocialLinksProps): ReactElement {
  return (
    <nav aria-label="Social links">
      <ul className={cn("flex flex-wrap items-center gap-5", className)}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
              className="text-sm font-medium text-ink-3 transition-colors hover:text-ink-1"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
