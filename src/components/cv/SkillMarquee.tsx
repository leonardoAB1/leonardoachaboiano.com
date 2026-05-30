"use client";

import type { ReactElement } from "react";
import { SKILL_ICONS } from "@/components/cv/SkillIcons";

// Icon size in px - each icon rendered at this dimension
const ICON_SIZE = 56;

interface SkillMarqueeProps {
  skills: string[];
}

export function SkillMarquee({ skills }: SkillMarqueeProps): ReactElement {
  // Duplicate the list so the second copy seamlessly follows the first.
  // The CSS animation translates -50% of the total track width, which
  // is exactly the width of one full set. When it resets, the second
  // copy has advanced to where the first started, so the loop is gapless.
  const doubled = [...skills, ...skills];

  return (
    // Full-bleed break-out: w-screen + left-1/2 + -translate-x-1/2 makes
    // this element span the full viewport regardless of the parent Container.
    <div
      className={[
        "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
      ].join(" ")}
    >
      {/* Track: wider than the viewport, scrolls right-to-left continuously */}
      <div className="flex w-max animate-marquee items-center gap-14 px-7 py-4">
        {doubled.map((skill, i) => {
          const Icon = SKILL_ICONS[skill];
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: stable doubly-indexed list
              key={i}
              title={skill}
              aria-label={skill}
              role="img"
              className="flex shrink-0 items-center justify-center text-ink-3 opacity-70 transition-opacity duration-200 hover:opacity-100"
            >
              {Icon ? (
                <Icon size={ICON_SIZE} />
              ) : (
                <span
                  className="select-none font-semibold leading-none"
                  style={{ fontSize: ICON_SIZE * 0.6 }}
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
