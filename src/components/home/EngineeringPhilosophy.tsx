import { useTranslations } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Heading, Text } from "@/components/ui/Typography";

export function EngineeringPhilosophy(): ReactElement {
  const t = useTranslations("Home.Philosophy");
  // Maps the <em> tag used in the message catalog to the brand-colored emphasis
  // span. Keeping the emphasis inside the translated string (rich text) lets
  // translators place it on the right word per language.
  const emphasis = (chunks: ReactNode): ReactElement => (
    <span className="font-medium text-brand">{chunks}</span>
  );

  // Transparent section on purpose: the body's paper texture runs through,
  // so this reads as the same sheet as the rest of the site (a solid bg here
  // left a flat, differently-tinted band under the hero photo).
  return (
    <Section className="border-t border-border">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-16 lg:gap-24">
          {/* Left column: heading + lead paragraph */}
          <AnimatedSection className="flex flex-col gap-6">
            <Heading as="h2" size="lg">
              {t("heading")}
            </Heading>
            <Text className="text-ink-2" size="md">
              {t.rich("p1", { em: emphasis })}
            </Text>
          </AnimatedSection>
          {/* Right column: supporting paragraph + closing quote */}
          <AnimatedSection delay={0.1} className="flex flex-col gap-6 sm:pt-1">
            <Text className="text-ink-2" size="md">
              {t.rich("p2", { em: emphasis })}
            </Text>
            <p className="text-sm italic text-ink-3">
              {t.rich("quote", { em: emphasis })}
            </p>
          </AnimatedSection>
        </div>
      </Container>
    </Section>
  );
}
