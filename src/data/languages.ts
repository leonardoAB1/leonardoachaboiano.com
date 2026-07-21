// Single source of truth for the CV language list, shared by the CV page
// (CVContent.tsx) and the PDF export route (cv/pdf/route.ts) so the two never
// drift out of sync. `countries` (flag codes) is only used by the web UI;
// the PDF route ignores it. Translated name/level text lives in messages
// under `CV.languageNames.<nameKey>` / `CV.languageLevels.<levelKey>`.
export const languages = [
  { nameKey: "spanish", levelKey: "native", countries: ["bo", "ar"] },
  { nameKey: "english", levelKey: "fluent", countries: ["us"] },
  { nameKey: "german", levelKey: "a2", countries: ["de", "ch"] },
  { nameKey: "italian", levelKey: "a2", countries: ["it"] },
] as const;
