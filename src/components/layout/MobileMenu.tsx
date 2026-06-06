"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactElement, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Mobile navigation drawer built on Radix Dialog. Radix owns the hard,
// easy-to-get-wrong parts of an accessible modal: focus trapping while open,
// returning focus to the trigger on close, locking body scroll, Escape to
// close, outside-click dismissal, `aria-modal`, and making the rest of the page
// inert. We only style it and decide how it animates.
//
// Why `forceMount` + `inert` on the panel (but not the overlay):
//   - `forceMount` keeps the panel (the heavy subtree: links, switchers) in the
//     DOM at all times, so the first tap never pays a mount cost (the regression
//     PR #234 fixed by pre-rendering the panel).
//   - Because the panel is always mounted, its links would otherwise stay in
//     the keyboard tab order while hidden. `inert={!open}` removes the closed
//     panel from the tab order and the accessibility tree without hiding it
//     visually, so the CSS slide-out still plays.
//   - The overlay is deliberately NOT force-mounted. Radix sets an inline
//     `pointer-events: auto` on it, so a force-mounted (always-present)
//     full-screen overlay would block the trigger underneath even when closed.
//     Letting Radix mount/unmount the overlay (a cheap empty div) sidesteps
//     that with no first-click cost.
//
// The panel's visibility is driven by a CSS transition keyed off Radix's
// `data-state` attribute. A CSS transition always settles on the final state
// for the current class, so the panel can never get "stuck" mid-animation the
// way an interrupted JS animation could - the root cause of issue #261.
export function MobileMenu({ overHero }: { overHero: boolean }): ReactElement {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-md",
            "transition-colors",
            overHero
              ? "text-white/70 hover:bg-white/10 hover:text-white"
              : "text-ink-3 hover:bg-surface-1 hover:text-ink-1",
            "focus-visible:outline focus-visible:outline-2",
            "focus-visible:outline-offset-2 focus-visible:outline-brand",
          )}
          aria-label={t("openMenu")}
        >
          <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </Dialog.Trigger>

      {/*
        Portal is intentionally NOT force-mounted: Radix propagates a Portal's
        `forceMount` to every child via context, which would keep the overlay
        permanently mounted (and Radix gives it inline `pointer-events: auto`,
        blocking the trigger). Force-mounting only the Content below keeps the
        panel pre-rendered while letting Radix mount/unmount the overlay.
      */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-sm" />
        <Dialog.Content
          forceMount
          inert={!open}
          aria-describedby={undefined}
          className={cn(
            "fixed right-0 top-0 z-[60] flex h-full w-72 flex-col",
            "bg-surface-0 shadow-xl focus:outline-none",
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
            "data-[state=open]:translate-x-0",
            "data-[state=closed]:translate-x-full data-[state=closed]:pointer-events-none",
          )}
        >
          {/* Radix requires a title for screen readers; it is visually hidden. */}
          <Dialog.Title className="sr-only">{t("ariaLabel")}</Dialog.Title>

          <div className="flex h-14 items-center justify-end px-6">
            <Dialog.Close asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-md",
                  "text-ink-3 transition-colors",
                  "hover:bg-surface-1 hover:text-ink-1",
                  "focus-visible:outline focus-visible:outline-2",
                  "focus-visible:outline-offset-2 focus-visible:outline-brand",
                )}
                aria-label={t("closeMenu")}
              >
                <X className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-1 px-4 py-2">
            {navLinks.map((link) => (
              <Dialog.Close asChild key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className={cn(
                    "rounded-md px-3 py-2.5",
                    "text-sm uppercase tracking-widest transition-colors",
                    pathname === link.href
                      ? "bg-surface-1 font-medium text-ink-1"
                      : "text-ink-3 hover:bg-surface-1 hover:text-ink-1",
                  )}
                >
                  {t(link.key)}
                </Link>
              </Dialog.Close>
            ))}
          </nav>

          <div className="mx-4 border-t border-border" />

          <div className="flex items-center gap-2 px-4 py-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
