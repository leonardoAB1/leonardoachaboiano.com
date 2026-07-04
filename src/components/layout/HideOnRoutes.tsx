"use client";

import type { ReactElement, ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

interface HideOnRoutesProps {
  /** Locale-stripped pathnames (e.g. "/contact") where children are hidden. */
  routes: string[];
  children: ReactNode;
}

// Client-side visibility gate for layout chrome. The children are rendered by
// the server layout and passed through, so wrapping a server component (like
// Footer) does not turn it into a client component - only the on/off decision
// runs on the client, where the pathname lives.
export function HideOnRoutes({
  routes,
  children,
}: HideOnRoutesProps): ReactElement | null {
  const pathname = usePathname();
  if (routes.includes(pathname)) {
    return null;
  }
  return <>{children}</>;
}
