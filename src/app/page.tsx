import type { ReactElement } from "react";
import { ContactCTA } from "@/components/home/ContactCTA";
import { EngineeringPhilosophy } from "@/components/home/EngineeringPhilosophy";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { RecentWriting } from "@/components/home/RecentWriting";
import { TechnicalDomains } from "@/components/home/TechnicalDomains";
import { Timeline } from "@/components/home/Timeline";
import { cn } from "@/lib/utils";

const backgroundWashClasses = cn(
  "pointer-events-none absolute inset-0 -z-10",
  "home-background-wash",
);

export default function HomePage(): ReactElement {
  return (
    <div className="relative isolate overflow-hidden bg-surface-0">
      <div aria-hidden="true" className={backgroundWashClasses} />
      <Hero />
      <EngineeringPhilosophy />
      <TechnicalDomains />
      <FeaturedProjects />
      <RecentWriting />
      <Timeline />
      <ContactCTA />
    </div>
  );
}
