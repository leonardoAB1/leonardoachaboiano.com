import type { ReactElement } from "react";
import { EngineeringPhilosophy } from "@/components/home/EngineeringPhilosophy";
import { Hero } from "@/components/home/Hero";
import { TechnicalDomains } from "@/components/home/TechnicalDomains";

export default function HomePage(): ReactElement {
  return (
    <>
      <Hero />
      <EngineeringPhilosophy />
      <TechnicalDomains />
    </>
  );
}
