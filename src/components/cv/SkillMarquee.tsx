"use client";

import type { ReactElement } from "react";
import { SKILL_ICONS } from "@/components/cv/SkillIcons";

interface SkillMarqueeProps {
  skills: string[];
}

export function SkillMarquee({ skills }: SkillMarqueeProps): ReactElement {
  // Duplicate the list so the second copy seamlessly follows the first.
  // The animation translates by -50%, which puts the second copy exactly
  // where the first started, creating a gapless loop.
  const doubled = [...skills, ...skills];

  return (
    // Full-bleed break-out trick: w-screen + left-1/2 + -translate-x-1/2
    // pushes the element to span the full viewport width regardless of
    // how deeply nested inside a max-w Container it is.
    <div
      className={[
        "group relative left-1/2 w-screen -translate-x-1/2 overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
      ].join(" ")}
    >
      <div className="flex w-max animate-marquee gap-3 px-3 py-1 group-hover:[animation-play-state:paused]">
        {doubled.map((skill, i) => {
          const Icon = SKILL_ICONS[skill];
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: stable doubly-indexed list
              key={i}
              title={skill}
              aria-label={skill}
              role="img"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-1 text-ink-2"
            >
              {Icon ? (
                <Icon size={20} />
              ) : (
                // Fallback: first letter monogram for skills without any logo
                <span
                  className="text-xs font-semibold leading-none"
                  aria-hidden="true"
                >
                  {skill.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
