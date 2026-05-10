"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { navLinks, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

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
        aria-label="Main navigation"
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
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
