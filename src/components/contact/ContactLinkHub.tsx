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
    <div className="relative border border-brand/45 px-5 pb-0 pt-10 lg:hidden">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Heading
          as="h1"
          size="xl"
          className="font-serif tracking-normal text-brand"
        >
          {heading}
        </Heading>
        <Text size="lg" className="mt-3 max-w-sm">
          {intro}
        </Text>

        <div className="mt-8 flex flex-col items-center">
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
            sizeClassName="size-36"
          />
          <Heading
            as="h2"
            size="md"
            className="mt-4 font-serif tracking-normal text-brand"
          >
            {siteConfig.name}
          </Heading>
          <Text size="sm" className="mt-1 text-ink-3">
            {role}
          </Text>
        </div>

        <ul className="mt-8 flex w-full flex-col gap-3 text-left">
          {links.map((link) => (
            <li key={link.id}>
              <ContactLinkCard link={link} />
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden="true"
        className="text-outline -mx-5 mt-10 overflow-hidden whitespace-nowrap font-serif text-[5.25rem] font-bold leading-[0.8]"
      >
        {outlineLine}
      </div>
    </div>
  );
}
