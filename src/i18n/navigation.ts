import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for next/link and the navigation hooks. These keep
// the active locale prefix on every internal link and programmatic navigation,
// so components never have to build "/{locale}/..." paths by hand.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
