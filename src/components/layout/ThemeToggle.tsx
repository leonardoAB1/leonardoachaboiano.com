"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { type ReactElement, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle(): ReactElement {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
        "text-ink-3 transition-colors hover:bg-surface-1 hover:text-ink-1",
        "focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-offset-2",
        "focus-visible:outline-brand",
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" strokeWidth={2} aria-hidden />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
