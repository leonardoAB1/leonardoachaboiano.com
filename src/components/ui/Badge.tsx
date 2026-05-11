import type { HTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "brand";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface-1 text-ink-2",
  brand: "border-brand/30 bg-surface-brand text-brand",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: BadgeProps): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
