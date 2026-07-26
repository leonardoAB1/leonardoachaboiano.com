import type { ReactElement } from "react";
import {
  type ContactLink,
  ContactLinkCard,
} from "@/components/contact/ContactLinkCard";
import { ProfileQrToggle } from "@/components/contact/ProfileQrToggle";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/BrandIcons";
import { Heading, Text } from "@/components/ui/Typography";
import { siteConfig, socialLinks } from "@/lib/constants";

interface ContactLinkHubProps {
  heading: string;
  intro: string;
  role: string;
  outlineLine: string;
  githubDescription: string;
  linkedinDescription: string;
  instagramDescription: string;
  facebookDescription: string;
  emailTitle: string;
  emailDescription: string;
  photoAlt: string;
  qrAlt: string;
  qrPath: string;
  qrViewBox: string;
  tapHint: string;
  qrCaption: string;
  showQrLabel: string;
  showPhotoLabel: string;
}

export function ContactLinkHub({
  heading,
  intro,
  role,
  outlineLine,
  githubDescription,
  linkedinDescription,
  instagramDescription,
  facebookDescription,
  emailTitle,
  emailDescription,
  photoAlt,
  qrAlt,
  qrPath,
  qrViewBox,
  tapHint,
  qrCaption,
  showQrLabel,
  showPhotoLabel,
}: ContactLinkHubProps): ReactElement {
  const links: ContactLink[] = [
    {
      id: "github",
      href: socialLinks.github,
      title: "GitHub",
      description: githubDescription,
      icon: <GitHubIcon size={32} />,
    },
    {
      id: "linkedin",
      href: socialLinks.linkedin,
      title: "LinkedIn",
      description: linkedinDescription,
      icon: <LinkedInIcon size={32} />,
    },
    {
      id: "instagram",
      href: socialLinks.instagram,
      title: "Instagram",
      description: instagramDescription,
      icon: <InstagramIcon size={32} />,
    },
    {
      id: "facebook",
      href: socialLinks.facebook,
      title: "Facebook",
      description: facebookDescription,
      icon: <FacebookIcon size={32} />,
    },
    {
      id: "email",
      href: socialLinks.email,
      title: emailTitle,
      description: emailDescription,
      icon: <MailIcon size={32} />,
    },
  ];

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden border border-brand/45 px-4 pt-3 lg:hidden">
      <div className="mx-auto flex h-full max-w-md flex-col items-center text-center">
        <Heading
          as="h1"
          size="xl"
          className="font-serif text-3xl tracking-normal text-brand [@media(min-height:760px)]:text-4xl"
        >
          {heading}
        </Heading>
        <Text
          size="sm"
          className="mt-1 max-w-sm leading-5 [@media(max-height:700px)]:text-xs"
        >
          {intro}
        </Text>

        <div className="mt-3 flex items-center gap-4 text-left [@media(max-height:700px)]:[&_figcaption]:hidden">
          <ProfileQrToggle
            photoSrc="/images/headshot.webp"
            photoAlt={photoAlt}
            qrAlt={qrAlt}
            qrPath={qrPath}
            qrViewBox={qrViewBox}
            tapHint={tapHint}
            qrCaption={qrCaption}
            showQrLabel={showQrLabel}
            showPhotoLabel={showPhotoLabel}
            qrBgClassName="bg-brand"
            qrColorClassName="text-white"
            sizeClassName="size-20 [@media(min-height:760px)]:size-24"
          />
          <div>
            <Heading
              as="h2"
              size="md"
              className="font-serif text-xl tracking-normal text-brand"
            >
              {siteConfig.name}
            </Heading>
            <Text size="sm" className="mt-0.5 leading-5 text-ink-3">
              {role}
            </Text>
          </div>
        </div>

        <ul className="mt-3 flex w-full flex-col gap-1.5 text-left [@media(min-height:760px)]:mt-5 [@media(min-height:760px)]:gap-2">
          {links.map((link) => (
            <li key={link.id}>
              <ContactLinkCard link={link} />
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden="true"
        className="text-outline -mx-4 mt-4 hidden overflow-hidden whitespace-nowrap font-serif text-6xl font-bold leading-[0.8] [@media(min-height:760px)]:block"
      >
        {outlineLine}
      </div>
    </div>
  );
}
