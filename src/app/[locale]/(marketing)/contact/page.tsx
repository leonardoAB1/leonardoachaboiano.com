import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { SVGProps } from "react";
import type { ReactElement } from "react";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/BrandIcons";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Separator } from "@/components/ui/Separator";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import type { Locale } from "@/i18n/routing";
import { siteConfig, socialLinks } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return pageMetadata({
    locale,
    pathname: "/contact",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");

  type BrandIconComponent = (
    props: SVGProps<SVGSVGElement> & { size?: number },
  ) => ReactElement;

  // Brand names are proper nouns (not translated); descriptions are localized.
  // Email's description is the address itself.
  const contactLinks: Array<{
    id: string;
    label: string;
    href: string;
    description: string;
    external: boolean;
    Icon: BrandIconComponent;
  }> = [
    {
      id: "github",
      label: "GitHub",
      href: socialLinks.github,
      description: t("links.github"),
      external: true,
      Icon: GitHubIcon,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: socialLinks.linkedin,
      description: t("links.linkedin"),
      external: true,
      Icon: LinkedInIcon,
    },
    {
      id: "instagram",
      label: "Instagram",
      href: socialLinks.instagram,
      description: t("links.instagram"),
      external: true,
      Icon: InstagramIcon,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: socialLinks.facebook,
      description: t("links.facebook"),
      external: true,
      Icon: FacebookIcon,
    },
    {
      id: "email",
      label: t("links.emailLabel"),
      href: socialLinks.email,
      description: siteConfig.email,
      external: false,
      Icon: MailIcon,
    },
  ];

  return (
    <Section>
      <Container>
        {/* Page header */}
        <div className="mb-12 flex flex-col gap-4">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <Heading as="h1" size="lg">
            {t("heading")}
          </Heading>
          <Text size="md" className="max-w-xl">
            {t("intro")}
          </Text>
        </div>

        <Separator className="mb-12" />

        {/* Two-column layout: form + contact links */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto] md:gap-16 lg:grid-cols-[1fr_280px]">
          {/* Left: contact form */}
          <div>
            <ContactForm />
          </div>

          {/* Right: other contact methods */}
          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-ink-1">
                {t("otherWaysTitle")}
              </p>
              <p className="text-sm text-ink-3">{t("otherWaysSubtitle")}</p>
            </div>

            <ul className="flex flex-col gap-3">
              {contactLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group flex flex-col gap-0.5 rounded-md border border-border bg-surface-1 px-4 py-3 transition-colors duration-150 hover:border-brand hover:bg-surface-brand"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-ink-1 group-hover:text-brand">
                      <link.Icon size={15} />
                      {link.label}
                    </span>
                    <span className="text-xs text-ink-3">
                      {link.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
