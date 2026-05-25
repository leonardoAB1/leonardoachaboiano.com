import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { ogLocales, siteConfig } from "@/lib/constants";

// Absolute URL for a locale + locale-agnostic page path.
// pathname is "" for home, "/cv", "/contact", ...
function localeUrl(locale: string, pathname: string): string {
  return `${siteConfig.url}/${locale}${pathname}`;
}

// hreflang alternates for a page: one entry per locale plus x-default pointing
// at the default locale. Search engines need these to treat the locale variants
// as alternates rather than duplicate content. canonical is self-referential so
// each locale page is its own canonical.
export function buildAlternates(
  locale: Locale,
  pathname: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localeUrl(l, pathname);
  }
  languages["x-default"] = localeUrl(routing.defaultLocale, pathname);

  return {
    canonical: localeUrl(locale, pathname),
    languages,
  };
}

// og:locale for the active locale + og:locale:alternate for the others.
export function ogLocaleFields(locale: Locale): {
  locale: string;
  alternateLocale: string[];
} {
  return {
    locale: ogLocales[locale],
    alternateLocale: routing.locales
      .filter((l) => l !== locale)
      .map((l) => ogLocales[l]),
  };
}

// Page-level metadata shared by the marketing pages (cv, contact). Sets a plain
// title (the parent template appends the site name), localized description and
// OpenGraph, per-locale OG locale fields, and the hreflang/canonical alternates.
export function pageMetadata(params: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, pathname, title, description } = params;
  const url = localeUrl(locale, pathname);

  return {
    title,
    description,
    alternates: buildAlternates(locale, pathname),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      ...ogLocaleFields(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
