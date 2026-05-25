import type { TimelineEntry } from "@/data/timeline";
import { formatDateRange } from "@/lib/format-date-range";

// Translatable text for a timeline entry, stored under Timeline.entries.<id>.
export interface TimelineContent {
  role: string;
  location: string;
  note?: string;
  bullets?: string[];
}

// A timeline entry with its translated text and formatted date range merged in,
// ready to render.
export interface ResolvedTimelineEntry extends TimelineEntry, TimelineContent {
  dateRange: string;
}

// Structural shape satisfied by both next-intl translators (useTranslations on
// the client, getTranslations on the server), scoped to the "Timeline" namespace.
interface TimelineTranslator {
  (key: string): string;
  raw: (key: string) => unknown;
}

// Merges locale-agnostic structural data (@/data/timeline) with the active
// locale's text and a localized date range. Used by the hero, the mobile globe
// modal, and the CV page so the merge logic lives in one place.
export function resolveTimelineEntry(
  entry: TimelineEntry,
  t: TimelineTranslator,
  locale: string,
): ResolvedTimelineEntry {
  const content = t.raw(`entries.${entry.id}`) as TimelineContent;
  return {
    ...entry,
    ...content,
    dateRange: formatDateRange(entry.start, entry.end, locale, t("present")),
  };
}
