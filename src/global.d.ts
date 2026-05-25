import type { routing } from "@/i18n/routing";

// Augments next-intl so the Locale type is the union of supported locales.
//
// We intentionally do NOT augment `Messages` here. Several surfaces look up keys
// dynamically (Timeline.entries.<id>, Projects.<id>, Achievements.<id>), which a
// literal-key Messages type would reject. Missing keys still surface at runtime
// during the static build (every locale page is pre-rendered), so they fail the
// build rather than slipping through.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
  }
}
