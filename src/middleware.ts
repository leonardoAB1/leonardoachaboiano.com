import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Handles locale negotiation:
// - bare "/" -> detect via NEXT_LOCALE cookie, then Accept-Language, then
//   default locale, and redirect to the prefixed URL
// - unprefixed paths (e.g. "/cv") -> redirected to the resolved locale ("/en/cv")
// - already-prefixed paths (e.g. "/es/cv") -> served as-is, never auto-redirected
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, Next internals, and files with an
  // extension (favicon.ico, robots.txt, sitemap.xml, manifest.webmanifest, ...).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
