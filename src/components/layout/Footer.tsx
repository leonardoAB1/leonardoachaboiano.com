import type { ReactElement } from "react";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Footer(): ReactElement {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-1">
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col items-center",
          "justify-between gap-4 px-6 py-8 sm:flex-row sm:px-8",
        )}
      >
        <p className="text-sm text-ink-3">
          &copy; {year} {siteConfig.name}
        </p>

        <SocialLinks />
      </div>
    </footer>
  );
}
