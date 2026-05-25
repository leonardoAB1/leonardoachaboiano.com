import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { buttonClasses } from "@/components/ui/Button";
import { Heading, Text } from "@/components/ui/Typography";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function ContactCTA(): ReactElement {
  const t = useTranslations("Home.ContactCTA");

  return (
    <Section className="bg-surface-brand">
      <Container>
        <AnimatedSection>
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex flex-col gap-4">
              <Heading as="h2" size="lg" className="mx-auto">
                {t("heading")}
              </Heading>
              <Text size="lg" className="mx-auto text-ink-2">
                {t("subtitle")}
              </Text>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className={cn(
                  buttonClasses({ variant: "primary", size: "lg" }),
                  "text-center",
                )}
              >
                {t("getInTouch")}
              </Link>
              <Link
                href="/cv"
                className={cn(
                  buttonClasses({ variant: "secondary", size: "lg" }),
                  "text-center",
                )}
              >
                {t("viewCv")}
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </Section>
  );
}
