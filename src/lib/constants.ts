export const siteUrl = "https://leonardoachaboiano.com";

export const siteConfig = {
  name: "Leonardo Acha Boiano",
  title: "Mechatronics Engineer",
  description: "Engineering portfolio of Leonardo Acha Boiano.",
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
