import { ArrowDownRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactElement, SVGProps } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ProfileQrToggle } from "@/components/contact/ProfileQrToggle";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
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

  // Marquee copy: two identical spans of this line make the -50% translate
  // loop seamless. Middle dots keep it readable at marquee speed.
  const marqueeLine = `${Array.from(
    { length: 4 },
    () => `${t("heading")} · ${t("eyebrow")}`,
  ).join(" · ")} ·`;

  return (
    // Viewport-fit page: -mt-14 pulls the tinted surface under the fixed
    // navbar and lg:h-svh pins the whole page to exactly one screen (the
    // global footer is hidden on this route). Below lg the stacked layout
    // scrolls naturally.
    <section className="-mt-14 flex min-h-svh flex-col px-4 pb-4 pt-20 sm:px-6 lg:h-svh">
      {/* Single connected box: straight corners so the teal border reads as
          a ruled grid line rather than a card. overflow-hidden clips the
          decorative outline lettering at the border, like the reference.
          Transparent on purpose - the section's paper texture runs through
          continuously (a second .grain here would tile from a different
          origin and seam at the border). */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Box edges as drawable rules (reference style): borders cannot be
            scale-animated, so each structural line is its own 1px element
            that draws in, staggered so the grid appears to sketch itself. */}
        <span
          aria-hidden="true"
          className="rule-x draw-x absolute inset-x-0 top-0"
        />
        <span
          aria-hidden="true"
          className="rule-x draw-x absolute inset-x-0 bottom-0 [animation-delay:150ms]"
        />
        <span
          aria-hidden="true"
          className="rule-y draw-y absolute inset-y-0 left-0"
        />
        <span
          aria-hidden="true"
          className="rule-y draw-y absolute inset-y-0 right-0 [animation-delay:150ms]"
        />
        {/* Decorative top strip, ruled cells as in the mockups:
              hatch | label + teal mark | flexible spacer */}
        <div className="relative flex h-10 shrink-0">
          <span
            aria-hidden="true"
            className="rule-x draw-x absolute inset-x-0 bottom-0 [animation-delay:200ms]"
          />
          {/* Hatch narrows on phones so the label cell fits on one line */}
          <div
            aria-hidden="true"
            className="relative w-14 shrink-0 sm:w-36"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgb(2 119 124 / 0.2) 0px, rgb(2 119 124 / 0.2) 2px, transparent 2px, transparent 10px)",
            }}
          >
            <span className="rule-y draw-y absolute inset-y-0 right-0 [animation-delay:350ms]" />
          </div>
          <div className="sweep-rule relative flex items-center gap-3 px-4 sm:px-6">
            <span
              aria-hidden="true"
              className="rule-y draw-y absolute inset-y-0 right-0 [animation-delay:350ms]"
            />
            <Eyebrow as="span" className="whitespace-nowrap">
              {t("eyebrow")}
            </Eyebrow>
            <span
              aria-hidden="true"
              className="size-5 shrink-0 rounded-full bg-brand"
            />
          </div>
          <div className="flex-1" />
        </div>

        <div className="relative grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
          {/* Column divider as a drawable rule (lg only) */}
          <span
            aria-hidden="true"
            className="rule-y draw-y absolute inset-y-0 left-1/2 hidden lg:block [animation-delay:400ms]"
          />
          {/* Left: heading + identity + decorative outline lettering */}
          {/* Content delays sit after the ~0.4s line draws so the grid
              sketches itself first, then the content fades in. */}
          <AnimatedSection
            delay={0.35}
            className="sweep-rule relative flex min-h-0 flex-col gap-8 p-8 lg:p-10"
          >
            <div className="flex flex-col gap-3">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              {/* Display lettering at reference scale: the site's biggest
                    type lives here, against the tiny tracked labels around it.
                    tracking-normal undoes the sans-oriented tracking-tight base. */}
              <Heading
                as="h1"
                size="xl"
                className="font-serif tracking-normal text-brand xl:text-7xl xl:leading-tight"
              >
                {t("heading")}
              </Heading>
              <Text size="lg">{t("intro")}</Text>
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
                sizeClassName="size-24 lg:size-28"
              />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <Heading
                    as="h2"
                    size="md"
                    className="font-serif tracking-normal text-brand sm:text-3xl"
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

            {/* Giant hollow lettering, reference style: pushed to the column
                  bottom and bled past the box edge, where overflow-hidden
                  clips it mid-glyph. Purely decorative. */}
            <div
              aria-hidden="true"
              className="text-outline pointer-events-none mt-auto -mb-6 -ml-10 select-none whitespace-nowrap font-serif text-7xl font-bold leading-none lg:-mb-8 lg:-ml-14 lg:text-9xl"
            >
              {t("outlineLine")}
            </div>
          </AnimatedSection>

          {/* Right: form. On mobile it stacks under the identity block with a
                teal top rule (a drawable line, lg hides it since the grid
                divider takes over); the column scrolls internally if the
                viewport is unusually short. */}
          <AnimatedSection
            delay={0.5}
            className="sweep-rule relative min-h-0 p-8 lg:overflow-y-auto lg:p-10"
          >
            <span
              aria-hidden="true"
              className="rule-x draw-x absolute inset-x-0 top-0 lg:hidden [animation-delay:400ms]"
            />
            <ContactForm />
          </AnimatedSection>
        </div>

        {/* Bottom strip - marquee plus corner arrow */}
        <div className="relative flex h-10 shrink-0">
          <span
            aria-hidden="true"
            className="rule-x draw-x absolute inset-x-0 top-0 [animation-delay:250ms]"
          />
          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              aria-hidden="true"
              className="marquee-track h-full items-center"
            >
              <span className="whitespace-nowrap pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-brand/60">
                {marqueeLine}
              </span>
              <span className="whitespace-nowrap pr-6 text-xs font-semibold uppercase tracking-[0.24em] text-brand/60">
                {marqueeLine}
              </span>
            </div>
          </div>
          <div className="group sweep-rule relative flex size-10 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              className="rule-y draw-y absolute inset-y-0 left-0 [animation-delay:350ms]"
            />
            <ArrowDownRight
              size={16}
              className="text-brand transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
