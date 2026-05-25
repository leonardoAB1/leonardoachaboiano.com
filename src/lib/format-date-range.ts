import type { DateMark, TimelineDate } from "@/data/timeline";

// Localized short month name (e.g. "Aug", "ago", "set") via Intl, so the same
// structured date renders correctly per locale. The day-of-month is irrelevant;
// we only format the month.
function monthShort(month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(
    new Date(Date.UTC(2000, month - 1, 1)),
  );
}

function formatMark(mark: DateMark, locale: string, withYear = true): string {
  if (mark.month == null) {
    return String(mark.year);
  }
  const month = monthShort(mark.month, locale);
  return withYear ? `${month} ${mark.year}` : month;
}

// Reproduces the site's custom range format while localizing month names:
//   - ongoing:           "Aug 2025 - Present"
//   - same calendar year: "Feb - Jul 2025"   (start year omitted)
//   - spanning years:     "Aug 2024 - Jan 2025"
//   - year-only ranges:   "2018 - 2019"
export function formatDateRange(
  start: DateMark,
  end: TimelineDate,
  locale: string,
  presentLabel: string,
): string {
  if (end === "present") {
    return `${formatMark(start, locale)} - ${presentLabel}`;
  }
  if (start.year === end.year && start.month != null && end.month != null) {
    return `${formatMark(start, locale, false)} - ${formatMark(end, locale)}`;
  }
  return `${formatMark(start, locale)} - ${formatMark(end, locale)}`;
}
