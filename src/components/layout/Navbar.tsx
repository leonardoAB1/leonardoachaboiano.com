"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useScrolled } from "@/hooks/useScrolled";
import { Link, usePathname } from "@/i18n/navigation";
import { navLinks, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar(): ReactElement {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const scrolled = useScrolled();
  const overHero = pathname === "/" && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full",
        "transition-all duration-300",
        scrolled
          ? "border-b border-border bg-surface-0/90 backdrop-blur-sm"
          : "border-b border-transparent",
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full",
          "items-center justify-between px-6 sm:px-8",
        )}
        aria-label={t("ariaLabel")}
      >
        <Link
          href="/"
          className={cn(
            "text-sm font-semibold tracking-tight transition-colors",
            overHero
              ? "text-white hover:text-white/80"
              : "text-ink-1 hover:text-brand",
          )}
        >
          <span className="hidden sm:inline">{siteConfig.name}</span>
          <span className="sm:hidden">
            Leonardo
            <span className={cn(overHero ? "text-white/80" : "text-brand")}>
              .
            </span>
            AB
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-5 lg:gap-6">
          <ul className="flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm uppercase tracking-widest transition-colors",
                    overHero
                      ? "text-white/70 hover:text-white"
                      : cn(
                          "hover:text-ink-1",
                          pathname === link.href
                            ? "font-medium text-ink-1"
                            : "text-ink-3",
                        ),
                  )}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher
            className={
              overHero
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : undefined
            }
          />
          <ThemeToggle
            className={
              overHero
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : undefined
            }
          />
        </div>
        <div className="sm:hidden">
          <MobileMenu overHero={overHero} />
        </div>
      </nav>
    </header>
  );
}
