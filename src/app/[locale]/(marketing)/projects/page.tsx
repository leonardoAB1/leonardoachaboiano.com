import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  return pageMetadata({
    locale,
    pathname: "/projects",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Projects");

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-10">
          <AnimatedSection className="flex flex-col gap-3">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <Heading as="h1" size="lg">
              {t("heading")}
            </Heading>
            <Text className="max-w-2xl text-fg-muted">{t("description")}</Text>
          </AnimatedSection>
          <ProjectsGrid />
        </div>
      </Container>
    </Section>
  );
}
