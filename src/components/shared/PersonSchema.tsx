import { siteConfig, socialLinks } from "@/lib/constants";

export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.title,
    email: siteConfig.email,
    sameAs: [socialLinks.github, socialLinks.linkedin],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled JSON-LD, no user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
