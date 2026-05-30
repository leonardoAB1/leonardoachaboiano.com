"use client";

import type { ReactElement } from "react";
import { SKILL_ICONS } from "@/components/cv/SkillIcons";

const ICON_SIZE = 48;

interface SkillGridProps {
  skills: string[];
}

export function SkillGrid({ skills }: SkillGridProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-6 px-6 sm:px-8">
      {skills.map((skill) => {
        const Icon = SKILL_ICONS[skill];
        return (
          <div
            key={skill}
            title={skill}
            aria-label={skill}
            role="img"
            className="flex cursor-default items-center justify-center text-ink-3 opacity-50 transition-all duration-200 hover:scale-110 hover:text-brand hover:opacity-100"
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
  );
}
