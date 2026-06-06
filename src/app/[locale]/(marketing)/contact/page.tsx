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

  return (
    <Section>
      <Container>
        {/* Single, borderless column. Header pairs the name block with a compact
            logo + QR; everything flows into the form below - no isolated panels. */}
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          {/* Header: name + role + socials on the left, logo + QR on the right
              (desktop). Stacks on mobile. */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Name block */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <Heading as="h1" size="lg">
                  {siteConfig.name}
                </Heading>
                <Text size="md" className="text-ink-2">
                  {tCommon("role")}
                </Text>
              </div>

              {/* Social icons under the name - borderless, footer-style */}
              <ul className="flex items-center gap-4">
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
                      className="text-ink-3 transition-colors duration-150 hover:text-brand"
                    >
                      <social.Icon size={20} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compact logo + QR - to the right of the name on desktop */}
            <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-3">
              <Image
                src="/images/logo.png"
                alt={siteConfig.name}
                width={56}
                height={56}
                className="size-12 rounded-full"
                priority
              />

              {/* QR - white backing keeps it scannable in dark mode; teal modules.
                  Encodes the canonical /contact URL. */}
              <figure className="flex flex-col items-center gap-1.5 sm:items-end">
                <div className="rounded-lg bg-white p-2">
                  <div className="relative size-28">
                    <Image
                      src="/images/contact-qr.png"
                      alt={t("qrAlt")}
                      fill
                      className="object-contain"
                      sizes="7rem"
                    />
                  </div>
                </div>
                <figcaption className="text-xs text-ink-4">
                  {t("qrCaption")}
                </figcaption>
              </figure>
            </div>
          </div>

          <Separator />

          {/* Contact form */}
          <div>
            <div className="mb-6 flex flex-col gap-2">
              <Heading as="h2" size="md">
                {t("heading")}
              </Heading>
              <Text size="md">{t("intro")}</Text>
            </div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
