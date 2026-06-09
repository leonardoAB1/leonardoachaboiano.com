import { setRequestLocale } from "next-intl/server";
import type { ReactElement } from "react";
import { EngineeringPhilosophy } from "@/components/home/EngineeringPhilosophy";
import { Hero } from "@/components/home/Hero";
import type { Locale } from "@/i18n/routing";

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
    <div className="-mt-14 relative overflow-hidden bg-surface-0">
      <Hero />
      <EngineeringPhilosophy />
    </div>
  );
}
