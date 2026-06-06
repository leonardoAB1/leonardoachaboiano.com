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
        {/* Desktop mirrors the CV globe layout: text + form on the left, the
            visual (headshot + QR) pinned right. On mobile it collapses to one
            centered column with the visual on top so the QR is easy to show. */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_18rem] lg:gap-x-16">
          {/* Text + form column (renders below the visual on mobile) */}
          <div className="order-last flex flex-col items-center gap-8 text-center lg:order-none lg:items-start lg:text-start">
            {/* Profile header */}
            <div className="flex flex-col items-center gap-4 lg:items-start">
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

          {/* Visual column: circular headshot + scannable QR. Side by side on
              mobile (so both are visible when showing the QR from a phone),
              stacked and sticky on desktop like the CV globe. */}
          <div className="order-first lg:order-none">
            <div className="flex flex-row items-center justify-center gap-6 lg:sticky lg:top-24 lg:flex-col lg:gap-8">
              {/* Circular headshot */}
              <div className="relative size-32 shrink-0 overflow-hidden rounded-full ring-2 ring-brand/20 sm:size-40 lg:size-44">
                <Image
                  src="/images/headshot.webp"
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 11rem, 10rem"
                  priority
                />
              </div>

              {/* QR code - white card so it scans reliably in both themes */}
              <figure className="flex flex-col items-center gap-2">
                <div className="rounded-xl border border-border bg-white p-3">
                  <div className="relative size-28 sm:size-32 lg:size-36">
                    <Image
                      src="/images/contact-qr.png"
                      alt={t("qrAlt")}
                      fill
                      className="object-contain"
                      sizes="9rem"
                    />
                  </div>
                </div>
                <figcaption className="max-w-[9rem] text-center text-xs text-ink-3">
                  {t("qrCaption")}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
