import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface TimelineEntryProps {
  dateRange: string;
  role: string;
  org: string;
  location: string;
  bullets?: readonly string[];
  note?: string;
  isActive?: boolean;
  isLast?: boolean;
}

export function TimelineEntry({
  dateRange,
  role,
  org,
  location,
  bullets,
  note,
  isActive,
  isLast,
}: TimelineEntryProps): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:gap-8">
      {/* Date column */}
      <div className="sm:pt-0.5">
        <span className="text-sm font-medium text-ink-3 sm:text-end">
          {dateRange}
        </span>
      </div>

      {/* Content column with vertical line indicator */}
      <div className={cn("relative border-s border-border-subtle ps-6", isLast ? "pb-0" : "pb-14")}>
        {/* Dot on the timeline line */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute -start-[5px] top-1.5 size-2.5 rounded-full border-2 border-brand transition-colors duration-200",
            isActive ? "bg-brand" : "bg-surface-0",
          )}
        />

        <p className="text-base font-semibold text-ink-1">{role}</p>
        <p className="mt-0.5 text-sm font-medium text-brand">{org}</p>
        <p className="mt-0.5 text-[clamp(0.75rem,3.5vw,0.875rem)] text-ink-4">
          {location}
        </p>

        {bullets && bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-2 text-sm text-ink-3 leading-6"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 shrink-0 size-1 rounded-full bg-ink-4"
                />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {note && (
          <p className="mt-3 text-[clamp(0.75rem,3.5vw,0.875rem)] italic text-ink-3 whitespace-pre-line">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
