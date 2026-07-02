import { ArrowDownRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactElement, SVGProps } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ProfileQrToggle } from "@/components/contact/ProfileQrToggle";
import { Section } from "@/components/layout/Section";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/BrandIcons";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { Link } from "@/i18n/navigation";
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
      {/* Plain wrapper with minimal padding - no max-width cap so the teal border
          sits just 12-16px from the viewport edge, matching the reference layout. */}
      <div className="px-4 sm:px-6">
        {/* Single connected box: straight corners so the teal border reads as
            a ruled grid line rather than a card. grain class layers the SVG
            noise texture on top of the solid white background. */}
        <div className="border border-brand/40 bg-surface-0 grain">
          {/* Decorative top strip, four ruled cells as in the mockups:
              hatch | label + teal mark | flexible spacer | works link */}
          <div className="flex h-10 border-b border-brand/40">
            {/* Hatch narrows on phones so the label and works cells fit on one line */}
            <div
              aria-hidden="true"
              className="w-14 shrink-0 border-r border-brand/40 sm:w-36"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, rgb(2 119 124 / 0.2) 0px, rgb(2 119 124 / 0.2) 2px, transparent 2px, transparent 10px)",
              }}
            />
            <div className="flex items-center gap-3 border-r border-brand/40 px-4 sm:px-6">
              <Eyebrow as="span" className="whitespace-nowrap">
                {t("eyebrow")}
              </Eyebrow>
              <span
                aria-hidden="true"
                className="size-5 shrink-0 rounded-full bg-brand"
              />
            </div>
            <div className="flex-1" />
            <Link
              href="/projects"
              className="hidden items-center gap-3 border-l border-brand/40 px-6 transition-colors duration-150 hover:bg-surface-brand sm:flex"
            >
              <Eyebrow as="span">{t("worksLabel")}</Eyebrow>
              <span aria-hidden="true" className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static decorative dots
                  <span key={i} className="size-0.5 rounded-full bg-brand/60" />
                ))}
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-brand/40">
            {/* Left: heading + identity */}
            <div className="flex flex-col gap-10 p-8">
              <div className="flex flex-col gap-3">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                {/* Serif display lettering per the reference: warm serif, brand
                    teal, moderate scale rather than hero scale. tracking-normal
                    undoes the sans-oriented tracking-tight base. */}
                <Heading
                  as="h1"
                  size="lg"
                  className="font-serif tracking-normal text-brand"
                >
                  {t("heading")}
                </Heading>
                <Text size="md">{t("intro")}</Text>
              </div>
              {/* Identity: photo LEFT, name+role+socials RIGHT - matches mockup composition */}
              <div className="flex items-start gap-5">
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
                  sizeClassName="size-24"
                />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <Heading
                      as="h2"
                      size="md"
                      className="font-serif tracking-normal text-brand sm:text-2xl"
                    >
                      {siteConfig.name}
                    </Heading>
                    <Text size="sm" className="text-ink-3">
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
                          className="text-brand/70 transition-colors duration-150 hover:text-brand"
                        >
                          <social.Icon size={18} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: form. On mobile it stacks under the identity block with a
                teal top rule; from lg the grid divider takes over. */}
            <div className="border-t border-brand/40 p-8 lg:border-t-0">
              <ContactForm />
            </div>
          </div>

          {/* Bottom strip - flexible spacer plus the corner arrow cell */}
          <div className="flex border-t border-brand/40">
            <div className="flex-1" />
            <div className="flex size-10 items-center justify-center border-l border-brand/40">
              <ArrowDownRight
                size={16}
                className="text-brand"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
