import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactElement, SVGProps } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/BrandIcons";
import { buttonClasses } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { Link } from "@/i18n/navigation";
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
  const tCommon = await getTranslations("Common");

  type BrandIconComponent = (
    props: SVGProps<SVGSVGElement> & { size?: number },
  ) => ReactElement;

  // Compact social row. Brand names are proper nouns (not translated); they
  // double as the icon-only links' accessible labels. Email is the only
  // non-external (mailto) entry, so it skips target/rel.
  const socialIcons: Array<{
    id: string;
    href: string;
    label: string;
    Icon: BrandIconComponent;
  }> = [
    {
      id: "github",
      href: socialLinks.github,
      label: "GitHub",
      Icon: GitHubIcon,
    },
    {
      id: "linkedin",
      href: socialLinks.linkedin,
      label: "LinkedIn",
      Icon: LinkedInIcon,
    },
    {
      id: "instagram",
      href: socialLinks.instagram,
      label: "Instagram",
      Icon: InstagramIcon,
    },
    {
      id: "facebook",
      href: socialLinks.facebook,
      label: "Facebook",
      Icon: FacebookIcon,
    },
    {
      id: "email",
      href: socialLinks.email,
      label: t("links.emailLabel"),
      Icon: MailIcon,
    },
  ];

  // Primary destination buttons (link-in-bio "stacked links"). Internal routes,
  // so they use the locale-aware Link to keep the active prefix.
  const bioLinks: Array<{ id: string; href: string; label: string }> = [
    { id: "cv", href: "/cv", label: t("bio.viewCv") },
    { id: "projects", href: "/projects", label: t("bio.projects") },
  ];

  return (
    <Section>
      <Container>
        {/* Desktop mirrors the CV globe layout: content left, portrait pinned
            right. On mobile it collapses to one centered link-in-bio column. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem] lg:gap-x-16">
          {/* Left column: profile, stacked links, then the form */}
          <div className="flex flex-col items-center gap-10 text-center lg:items-start lg:text-start">
            {/* Profile header */}
            <div className="flex flex-col items-center gap-4 lg:items-start">
              {/* Mobile-only avatar - desktop shows the larger portrait at right */}
              <div className="relative size-28 overflow-hidden rounded-full ring-2 ring-brand/20 lg:hidden">
                <Image
                  src="/images/profile.jpg"
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <Heading as="h1" size="lg">
                  {siteConfig.name}
                </Heading>
                <Text size="md" className="text-ink-2">
                  {tCommon("role")}
                </Text>
              </div>

              {/* Social icon row */}
              <ul className="flex items-center gap-2">
                {socialIcons.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      target={social.id === "email" ? undefined : "_blank"}
                      rel={
                        social.id === "email"
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="flex size-10 items-center justify-center rounded-full border border-border text-ink-2 transition-colors duration-150 hover:border-brand hover:bg-surface-brand hover:text-brand"
                    >
                      <social.Icon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stacked link buttons */}
            <div className="flex w-full max-w-md flex-col gap-3 lg:max-w-sm">
              {bioLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={buttonClasses({
                    size: "lg",
                    variant: "secondary",
                    className: "w-full",
                  })}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Separator className="w-full max-w-md lg:max-w-none" />

            {/* Contact form - left-aligned for readability on every viewport */}
            <div className="w-full max-w-md text-start lg:max-w-none">
              <div className="mb-6 flex flex-col gap-2">
                <Heading as="h2" size="md">
                  {t("heading")}
                </Heading>
                <Text size="md">{t("intro")}</Text>
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Right column: portrait - desktop only, sticky like the CV globe */}
          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-border">
                <Image
                  src="/images/profile.jpg"
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                  sizes="22rem"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
