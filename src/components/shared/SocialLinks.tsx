import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { socialLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  className?: string;
}

// "key" indexes into the SocialLinks message namespace. Brand names (GitHub,
// LinkedIn) are the same across locales; "email" localizes.
const links = [
  { key: "github", href: socialLinks.github },
  { key: "linkedin", href: socialLinks.linkedin },
  { key: "email", href: socialLinks.email },
] as const;

export function SocialLinks({ className }: SocialLinksProps): ReactElement {
  const t = useTranslations("SocialLinks");

  return (
    <nav aria-label={t("ariaLabel")}>
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
              {t(link.key)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
