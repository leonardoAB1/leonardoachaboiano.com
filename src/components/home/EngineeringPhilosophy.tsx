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

  return (
    <Section className="bg-surface-brand">
      <Container>
        <AnimatedSection className="flex flex-col gap-8">
          <Heading as="h2" size="md">
            {t("heading")}
          </Heading>
          <div className="flex max-w-2xl flex-col gap-6">
            <Text className="text-ink-2" size="md">
              {t.rich("p1", { em: emphasis })}
            </Text>
            <Text className="text-ink-2" size="md">
              {t.rich("p2", { em: emphasis })}
            </Text>
          </div>
          <p className="max-w-2xl text-sm italic text-ink-3">
            {t.rich("quote", { em: emphasis })}
          </p>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
