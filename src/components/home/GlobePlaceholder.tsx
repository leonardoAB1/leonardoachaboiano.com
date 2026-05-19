import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface GlobePlaceholderProps {
  className?: string;
}

export function GlobePlaceholder({
  className,
}: GlobePlaceholderProps): ReactElement {
  return (
    <div aria-hidden="true" className={cn("relative h-full w-full", className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, color-mix(in srgb, #02e0e8 14%, transparent) 0%, transparent 52%), radial-gradient(circle at 50% 48%, color-mix(in srgb, #02777c 8%, transparent) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute inset-[18%] rounded-full border border-brand/20"
        style={{
          boxShadow:
            "0 0 48px color-mix(in srgb, #02e0e8 12%, transparent), inset 0 0 32px color-mix(in srgb, #02777c 6%, transparent)",
        }}
      />
    </div>
  );
}
