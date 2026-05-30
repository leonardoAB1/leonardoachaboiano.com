import Link from "next/link";
import { useTranslations } from "next-intl";
import type { SVGProps } from "react";
import type { ReactElement } from "react";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/BrandIcons";
import { socialLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  className?: string;
}

type BrandIconComponent = (props: SVGProps<SVGSVGElement> & { size?: number }) => ReactElement;

// "key" indexes into the SocialLinks message namespace. Brand names (GitHub,
// LinkedIn) are the same across locales; "email" localizes.
const links: Array<{
  key: "github" | "linkedin" | "email";
  href: string;
  Icon: BrandIconComponent;
}> = [
  { key: "github", href: socialLinks.github, Icon: GitHubIcon },
  { key: "linkedin", href: socialLinks.linkedin, Icon: LinkedInIcon },
  { key: "email", href: socialLinks.email, Icon: MailIcon },
];

export function SocialLinks({ className }: SocialLinksProps): ReactElement {
  const t = useTranslations("SocialLinks");

  return (
    <nav aria-label={t("ariaLabel")}>
      <ul className={cn("flex flex-wrap items-center gap-4", className)}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-label={t(link.key)}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
              className="text-ink-3 transition-colors hover:text-ink-1"
            >
              <link.Icon aria-hidden="true" size={18} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
