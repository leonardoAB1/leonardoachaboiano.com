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
    <Section className="-mt-14 min-h-svh bg-surface-brand grain pt-28 sm:pt-32">
      {/* Tighter horizontal padding brings the outer border closer to the edge,
          matching the narrow-margin grid feel of the reference. */}
      <Container className="px-4 sm:px-6">
        {/* Single connected box: straight corners so the teal border reads as
            a ruled grid line rather than a card. grain class layers the SVG
            noise texture on top of the solid white background. */}
        <div className="border border-brand/40 bg-surface-0 grain">
          {/* Decorative top strip - hatched cell on left, eyebrow label on right */}
          <div className="flex h-10 border-b border-brand/40">
            <div
              aria-hidden="true"
              className="w-24 shrink-0 border-r border-brand/40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, rgb(2 119 124 / 0.2) 0px, rgb(2 119 124 / 0.2) 2px, transparent 2px, transparent 10px)",
              }}
            />
            <div className="flex items-center px-6">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-brand/40">
            {/* Left: heading + identity */}
            <div className="flex flex-col gap-10 p-8">
              <div className="flex flex-col gap-3">
                <Heading as="h1" size="xl">
                  {t("heading")}
                </Heading>
                <Text size="md">{t("intro")}</Text>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
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
                <div className="flex flex-col gap-1">
                  <Heading as="h2" size="md">
                    {siteConfig.name}
                  </Heading>
                  <Text size="md" className="text-ink-2">
                    {tCommon("role")}
                  </Text>
                </div>
                <ul className="flex items-center gap-3">
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
            </div>

            {/* Right: form - desktop only */}
            <div className="hidden lg:block p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
