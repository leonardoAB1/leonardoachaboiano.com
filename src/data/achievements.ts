// Single source of truth for achievement order/keys, shared by the CV page
// (CVContent.tsx) and the PDF export route (cv/pdf/route.ts) so the two never
// drift out of sync. Translated label/date/description text lives in
// messages under `Achievements.<key>` and is pulled in at render time.
export const achievementKeys = [
  "icpc",
  "diplomaHonour2",
  "cswa",
  "diplomaHonour1",
  "scholarship3",
  "scholarship2",
  "scholarship1",
  "diplomaHonour0",
  "rotary",
] as const;
