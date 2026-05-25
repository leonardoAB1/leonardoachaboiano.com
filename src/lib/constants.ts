export const siteUrl = "https://leonardoachaboiano.com";

const _name = "Leonardo Acha Boiano";
const _title = "Mechatronics Engineer";

export const siteConfig = {
  name: _name,
  title: _title,
  siteTitle: `${_name} - ${_title}`,
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

// OpenGraph locale identifiers (language_REGION) per supported locale. Used for
// og:locale and og:locale:alternate so social platforms label each page's
// language correctly.
export const ogLocales = {
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  it: "it_IT",
} as const;

// "key" indexes into the Nav message namespace; labels are resolved per locale
// in the navbar. "href" is locale-agnostic - the locale-aware Link adds the
// active prefix.
export const navLinks = [
  { key: "cv", href: "/cv" },
  { key: "contact", href: "/contact" },
] as const;

export const socialLinks = {
  github: "https://github.com/leonardoAB1",
  linkedin: "https://www.linkedin.com/in/leonardoachaboiano",
  instagram: "https://www.instagram.com/leonardo.ab1/",
  facebook: "https://www.facebook.com/leonardo.achaboiano",
  email: "mailto:leonardoacha@hotmail.com",
} as const;
