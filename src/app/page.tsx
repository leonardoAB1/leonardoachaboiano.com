import type { ReactElement } from "react";
import { EngineeringPhilosophy } from "@/components/home/EngineeringPhilosophy";
import { Hero } from "@/components/home/Hero";
import { TechnicalDomains } from "@/components/home/TechnicalDomains";

export default function HomePage(): ReactElement {
  return (
    <div className="relative isolate overflow-hidden bg-surface-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(207,234,217,0.42),rgba(255,255,255,0)_38rem),radial-gradient(circle_at_18%_6%,rgba(2,119,124,0.14),transparent_30rem),radial-gradient(circle_at_82%_12%,rgba(207,234,217,0.55),transparent_28rem)] dark:bg-[linear-gradient(180deg,rgba(13,35,24,0.68),rgba(10,10,10,0.18)_42rem),radial-gradient(circle_at_18%_6%,rgba(2,119,124,0.34),transparent_32rem),radial-gradient(circle_at_80%_10%,rgba(13,35,24,0.78),transparent_30rem)]"
      />
      <Hero />
      <EngineeringPhilosophy />
      <TechnicalDomains />
    </div>
  );
}
