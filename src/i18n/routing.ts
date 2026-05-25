import { defineRouting } from "next-intl/routing";

// Single source of truth for the locale set. Adding a locale here (plus its
// messages/<locale>.json file) extends the whole site - routing, middleware,
// hreflang, and the language switcher all read from this list, so no further
// code changes are required to support a new language.
export const routing = defineRouting({
  locales: ["en", "es", "de", "it"],
  defaultLocale: "en",
  // "always" keeps every URL locale-prefixed (/en/cv, /es/cv). The bare "/"
  // is handled by the middleware, which detects the visitor's language and
  // redirects to the best match.
  localePrefix: "always",
  // Detect the preferred locale from the Accept-Language header / NEXT_LOCALE
  // cookie on the bare "/" entry point only. Prefixed URLs stay authoritative
  // so crawlers can reach every locale variant directly.
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
