import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import type { ReactElement, ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import { PersonSchema } from "@/components/shared/PersonSchema";
import { type Locale, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/constants";
import { GLOBE_TEXTURE_PRELOAD_HREFS } from "@/lib/globe-textures";
import { buildAlternates, ogLocaleFields } from "@/lib/metadata";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Pre-renders one static page per locale at build time instead of rendering on
// demand. Combined with setRequestLocale below, this keeps every locale fully
// static.
export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("titleDefault");
  const description = t("description");

  return {
    title: {
      default: title,
      template: `%s - ${siteConfig.name}`,
    },
    description,
    metadataBase: new URL(siteConfig.url),
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    alternates: buildAlternates(locale, ""),
    openGraph: {
      type: "website",
      url: `${siteConfig.url}/${locale}`,
      title,
      description,
      siteName: siteConfig.name,
      ...ogLocaleFields(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>): Promise<ReactElement> {
  const { locale } = await params;
  // Reject unknown locales with a 404 instead of rendering a broken page.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Opt this layout into static rendering for the resolved locale.
  setRequestLocale(locale);

  const messages = await getMessages();
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {GLOBE_TEXTURE_PRELOAD_HREFS.map((href) => (
          <link key={href} rel="preload" as="image" href={href} />
        ))}
      </head>
      <body className="flex min-h-screen flex-col bg-surface-0 text-ink-1 antialiased">
        <PersonSchema jobTitle={tCommon("role")} />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
