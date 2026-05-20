export const siteUrl = "https://leonardoachaboiano.com";

const _name = "Leonardo Acha Boiano";
const _title = "Mechatronics Engineer";

export const siteConfig = {
  name: _name,
  title: _title,
  siteTitle: `${_name} - ${_title} & Portfolio`,
  description:
    "Mechatronics engineer with experience in robotics, embedded systems, and product design. " +
    "Engineering portfolio, projects, and technical writing.",
  url: siteUrl,
  email: "leonardoacha@hotmail.com",
  locale: "en_US",
  keywords: [
    "Leonardo Acha Boiano",
    "mechatronics engineer",
    "robotics engineer",
    "embedded systems",
    "product design",
    "hardware software integration",
    "engineering portfolio",
  ],
} as const;

export const navLinks = [
  { label: "CV", href: "/cv" },
  { label: "Contact", href: "/contact" },
] as const;

export const socialLinks = {
  github: "https://github.com/leonardoAB1",
  linkedin: "https://www.linkedin.com/in/leonardoachaboiano",
  instagram: "https://www.instagram.com/leonardo.ab1/",
  facebook: "https://www.facebook.com/leonardo.achaboiano",
  email: "mailto:leonardoacha@hotmail.com",
} as const;
