import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Footer(): ReactElement {
  const t = useTranslations("Footer");
  // Pass the year as a string so ICU inserts it verbatim (a numeric value would
  // pick up locale digit grouping, e.g. "2,026").
  const year = String(new Date().getFullYear());

  return (
    <footer className="border-t border-border bg-surface-1">
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col items-center",
          "justify-between gap-4 px-6 py-8 sm:flex-row sm:px-8",
        )}
      >
        <p className="text-sm text-ink-3">
          {t("copyright", { year, name: siteConfig.name })}
        </p>

        <SocialLinks />
      </div>
    </footer>
  );
}
