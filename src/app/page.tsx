import type { ReactElement } from "react";
import { EngineeringPhilosophy } from "@/components/home/EngineeringPhilosophy";
import { Hero } from "@/components/home/Hero";
import { TechnicalDomains } from "@/components/home/TechnicalDomains";
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
    </div>
  );
}
