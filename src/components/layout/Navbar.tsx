"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { navLinks, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar(): ReactElement {
  // usePathname from next-intl returns the path without the locale prefix
  // (e.g. "/cv"), so it matches navLinks hrefs directly.
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border",
        "bg-surface-0/90 backdrop-blur-sm",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex h-14 w-full max-w-5xl",
          "items-center justify-between px-6 sm:px-8",
        )}
        aria-label={t("ariaLabel")}
      >
        <Link
          href="/"
          className={cn(
            "text-sm font-semibold tracking-tight",
            "text-ink-1 transition-colors hover:text-brand",
          )}
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="flex items-center gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors hover:text-ink-1",
                    pathname === link.href && "font-medium text-ink-1",
                    pathname !== link.href && "text-ink-3",
                  )}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
