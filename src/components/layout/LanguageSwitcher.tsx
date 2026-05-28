"use client";

import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
}: {
  className?: string;
}): ReactElement {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside or pressing Escape.
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function selectLocale(next: Locale) {
    setOpen(false);
    if (next !== locale) {
      // Navigating with next-intl's router preserves the current path, swaps the
      // locale prefix, and writes the NEXT_LOCALE cookie so the choice wins over
      // Accept-Language detection on future visits.
      router.replace(pathname, { locale: next });
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-md px-2",
          "text-sm font-medium text-ink-3 transition-colors",
          "hover:bg-surface-1 hover:text-ink-1",
          className,
          "focus-visible:outline focus-visible:outline-2",
          "focus-visible:outline-offset-2 focus-visible:outline-brand",
        )}
        aria-label={t("ariaLabel")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="uppercase">{locale}</span>
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>

      {open && (
        <div
          className={cn(
            "absolute end-0 z-50 mt-2 flex min-w-[9rem] flex-col overflow-hidden",
            "rounded-md border border-border bg-surface-0 py-1 shadow-lg",
          )}
        >
          {routing.locales.map((option) => {
            const isActive = option === locale;
            return (
              <button
                key={option}
                type="button"
                aria-current={isActive}
                onClick={() => selectLocale(option)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-1.5",
                  "text-start text-sm transition-colors hover:bg-surface-1",
                  isActive ? "font-medium text-ink-1" : "text-ink-3",
                )}
              >
                {t(`locales.${option}`)}
                {isActive && <Check className="h-3.5 w-3.5" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
