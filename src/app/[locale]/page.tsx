import { setRequestLocale } from "next-intl/server";
import type { ReactElement } from "react";
import { ContactCTA } from "@/components/home/ContactCTA";
import { EngineeringPhilosophy } from "@/components/home/EngineeringPhilosophy";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { TechnicalDomains } from "@/components/home/TechnicalDomains";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const backgroundWashClasses = cn(
  "pointer-events-none absolute inset-0 -z-10",
  "home-background-wash",
);

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<ReactElement> {
  const { locale } = await params;
  // Enable static rendering for this locale (next-intl requirement when using
  // useTranslations in descendant components without dynamic APIs).
  setRequestLocale(locale);

  return (
    <div className="-mt-14 relative isolate overflow-hidden bg-surface-0">
      <div aria-hidden="true" className={backgroundWashClasses} />
      <Hero />
      <EngineeringPhilosophy />
      <TechnicalDomains />
      <FeaturedProjects />
      <ContactCTA />
    </div>
  );
}
