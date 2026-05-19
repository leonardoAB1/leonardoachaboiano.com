import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface TimelineEntryProps {
  dateRange: string;
  role: string;
  org: string;
  location: string;
  bullets?: readonly string[];
  note?: string;
}

export function TimelineEntry({
  dateRange,
  role,
  org,
  location,
  bullets,
  note,
}: TimelineEntryProps): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:gap-8">
      {/* Date column */}
      <div className="sm:pt-0.5">
        <span className="text-sm font-medium text-ink-3 sm:text-right">
          {dateRange}
        </span>
      </div>

      {/* Content column with vertical line indicator */}
      <div className="relative border-l border-border-subtle pl-6 pb-10 last:pb-0">
        {/* Dot on the timeline line */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute -left-[5px] top-1.5 size-2.5 rounded-full",
            "bg-surface-0 border-2 border-brand",
          )}
        />

        <p className="text-base font-semibold text-ink-1">{role}</p>
        <p className="mt-0.5 text-sm font-medium text-brand">{org}</p>
        <p className="mt-0.5 text-xs text-ink-4">{location}</p>

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

        {note && <p className="mt-3 text-xs italic text-ink-3">{note}</p>}
      </div>
    </div>
  );
}
