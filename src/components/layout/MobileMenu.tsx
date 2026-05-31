"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactElement, useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

const backdropVariants = {
  closed: { opacity: 0, transition: { duration: 0.16, ease: "linear" as const } },
  open: { opacity: 1, transition: { duration: 0.18, ease: "linear" as const } },
};

const panelVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "tween" as const,
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
  open: {
    x: 0,
    transition: {
      type: "tween" as const,
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function MobileMenu({ overHero }: { overHero: boolean }): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Nav");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
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
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>

      <motion.div
        variants={backdropVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-sm"
        onClick={closeMenu}
        aria-hidden
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      />
      <motion.div
        variants={panelVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        aria-hidden={!isOpen}
        className={cn(
          "fixed right-0 top-0 z-[60] flex h-full w-72 flex-col",
          "bg-surface-0 shadow-xl",
        )}
      >
        <div className="flex h-14 items-center justify-end px-6">
          <button
            type="button"
            onClick={closeMenu}
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
        </div>

        <nav className="flex flex-col gap-1 px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
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
          ))}
        </nav>

        <div className="mx-4 border-t border-border" />

        <div className="flex items-center gap-2 px-4 py-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </motion.div>
    </>
  );
}
