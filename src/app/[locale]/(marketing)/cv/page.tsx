import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactElement } from "react";
import { CVContent } from "@/components/cv/CVContent";
import { DownloadButton } from "@/components/cv/DownloadButton";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Separator } from "@/components/ui/Separator";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import type { Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CV" });
  return pageMetadata({
    locale,
    pathname: "/cv",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function CVPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("CV");
  const tCommon = await getTranslations("Common");

  return (
    <div className="bg-surface-0">
      {/* Header - server rendered, no interaction needed */}
      <Section as="header" className="py-8 sm:py-12">
        <Container>
          <AnimatedSection>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow className="mb-3">{t("eyebrow")}</Eyebrow>
                <Heading as="h1" size="xl">
                  {siteConfig.name}
                </Heading>
                <Text size="lg" className="mt-2 max-w-none">
                  {tCommon("role")}
                </Text>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-3">
                  <span>{t("location")}</span>
                  <span aria-hidden="true" className="text-border">
                    |
                  </span>
                  <a
                    className="transition-colors hover:text-brand"
                    href={`mailto:${siteConfig.email}`}
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              <div className="shrink-0">
                <DownloadButton />
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      <Separator />

      {/* Two-column content delegated to a client component so the globe and
          timeline list can share interactive state (selectedIndex) */}
      <Section className="py-8 sm:py-12">
        <Container>
          <CVContent />
        </Container>
      </Section>
    </div>
  );
}
