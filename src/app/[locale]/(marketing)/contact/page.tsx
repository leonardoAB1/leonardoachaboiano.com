import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactElement, SVGProps } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ProfileQrToggle } from "@/components/contact/ProfileQrToggle";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/BrandIcons";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import type { Locale } from "@/i18n/routing";
import { siteConfig, socialLinks } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { qrRoundedPath } from "@/lib/qr";

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

  // QR generated server-side so the `qrcode` lib never reaches the client bundle;
  // only the finished path string crosses into the client toggle component.
  const qr = qrRoundedPath(`${siteConfig.url}/contact`);

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
    <Section className="-mt-14 min-h-svh bg-surface-brand pt-28 sm:pt-32">
      <Container>
        {/* The whole screen takes the brand-tinted surface so contact reads as a
            distinct space. Mobile shows only the card (tap-to-reveal link-in-bio);
            desktop adds the contact form as the main column. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_20rem] lg:gap-x-16">
          {/* Contact form - desktop only */}
          <div className="hidden lg:block">
            <div className="mb-6 flex flex-col gap-2">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <Heading as="h2" size="md">
                {t("heading")}
              </Heading>
              <Text size="md">{t("intro")}</Text>
            </div>
            <ContactForm />
          </div>

          {/* Card: squircle photo that flips to the QR, plus name and socials.
              No panel - it sits directly on the brand-tinted page. */}
          <div className="lg:sticky lg:top-24">
            <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 text-center">
              <ProfileQrToggle
                photoSrc="/images/headshot.webp"
                photoAlt={siteConfig.name}
                qrAlt={t("qrAlt")}
                qrPath={qr.path}
                qrViewBox={qr.viewBox}
                tapHint={t("tapHint")}
                qrCaption={t("qrCaption")}
                showQrLabel={t("showQr")}
                showPhotoLabel={t("showPhoto")}
                qrBgClassName="bg-brand"
                qrColorClassName="text-white"
              />

              {/* Name leads the card (page h1) */}
              <div className="flex flex-col gap-1">
                <Heading as="h1" size="lg">
                  {siteConfig.name}
                </Heading>
                <Text size="md" className="text-ink-2">
                  {tCommon("role")}
                </Text>
              </div>

              {/* Social icons - outlined teal chips so they read as secondary to
                  the name; they fill on hover for clear affordance */}
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
                      className="flex size-10 items-center justify-center rounded-full border border-brand/40 text-brand transition-colors duration-150 hover:border-brand hover:bg-brand hover:text-white"
                    >
                      <social.Icon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
