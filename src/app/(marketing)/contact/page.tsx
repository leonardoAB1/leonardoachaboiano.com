import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Separator } from "@/components/ui/Separator";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { siteConfig, socialLinks } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Leonardo Acha Boiano - mechatronics and robotics engineer. Available for project collaborations, embedded systems work, and engineering inquiries.",
};

const contactLinks = [
  {
    label: "GitHub",
    href: socialLinks.github,
    description: "Open-source projects and code",
    external: true,
  },
  {
    label: "LinkedIn",
    href: socialLinks.linkedin,
    description: "Professional profile and experience",
    external: true,
  },
  {
    label: "Email",
    href: socialLinks.email,
    description: siteConfig.email,
    external: false,
  },
] as const;

export default function ContactPage(): ReactElement {
  return (
    <Section>
      <Container>
        {/* Page header */}
        <div className="mb-12 flex flex-col gap-4">
          <Eyebrow>Get in touch</Eyebrow>
          <Heading as="h1" size="lg">
            Let&apos;s talk
          </Heading>
          <Text size="md" className="max-w-xl">
            Whether you&apos;re working on a robotics project, looking for an
            embedded systems engineer, or just want to say hello - I&apos;d love
            to hear from you.
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
                Other ways to reach me
              </p>
              <p className="text-sm text-ink-3">
                Prefer a direct channel? Use any of the links below.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group flex flex-col gap-0.5 rounded-md border border-border bg-surface-1 px-4 py-3 transition-colors duration-150 hover:border-brand hover:bg-surface-brand"
                  >
                    <span className="text-sm font-medium text-ink-1 group-hover:text-brand">
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
