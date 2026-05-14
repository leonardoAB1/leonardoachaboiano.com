export const siteUrl = "https://leonardoachaboiano.com";

const _name = "Leonardo Acha Boiano";
const _title = "Mechatronics Engineer";

export const siteConfig = {
  name: _name,
  title: _title,
  siteTitle: `${_name} - ${_title} & Portfolio`,
  description:
    "Mechatronics engineer specializing in embedded systems, robotics, " +
    "and hardware-software integration. Portfolio, projects, and technical writing.",
  url: siteUrl,
  email: "leonardoacha@hotmail.com",
} as const;

export const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "CV", href: "/cv" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const socialLinks = {
  github: "https://github.com/leonardoAB1",
  linkedin: "https://www.linkedin.com/in/leonardoachaboiano",
  email: "mailto:leonardoacha@hotmail.com",
} as const;
