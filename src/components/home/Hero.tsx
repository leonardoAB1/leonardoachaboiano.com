"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const portraitVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
};

export function Hero(): ReactElement {
  const t = useTranslations("Home.Hero");
  const tCommon = useTranslations("Common");

  return (
    <Section className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-16 pt-[calc(3.5rem+2rem)] sm:pb-20 sm:pt-[calc(3.5rem+2.5rem)] lg:justify-center">
      {/* Portrait — face centered on mobile, right-anchored on desktop */}
      <motion.div
        className="absolute inset-0"
        aria-hidden="true"
        initial="hidden"
        animate="show"
        variants={portraitVariants}
      >
        <Image
          src="/images/portrait-hero.webp"
          alt=""
          fill
          className="object-cover object-center lg:object-right-top"
          priority
          quality={90}
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoKAAcAAoBCJagCdAEPDXkosAD+6/tYvsYx6jubpP0KAfwYHfz0mzz5AAA="
          sizes="100vw"
        />
      </motion.div>

      {/* Text content — in normal flow, stacks above absolute layers via DOM order */}
      <Container className="relative max-w-7xl">
        <motion.div
          className="flex max-w-xl flex-col gap-8"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.div variants={item}>
            <Eyebrow className="text-white/70">{tCommon("role")}</Eyebrow>
          </motion.div>
          <motion.div variants={item}>
            <Heading
              as="h1"
              size="xl"
              className="break-words text-white [hyphens:auto] text-[clamp(2rem,5vw,3rem)] leading-tight sm:text-[clamp(2rem,5vw,3rem)]"
            >
              {t("heading")}
            </Heading>
          </motion.div>
          <motion.div variants={item}>
            <Text className="text-white/80" size="lg">
              {t("intro")}
            </Text>
          </motion.div>
          <motion.div
            variants={item}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Link
              className={cn(
                buttonClasses({ size: "lg", variant: "primary" }),
                "bg-white text-brand hover:bg-white/90",
                "text-center",
              )}
              href="/cv"
            >
              {t("viewCv")}
            </Link>
            <Link
              className={cn(
                buttonClasses({ size: "lg", variant: "secondary" }),
                "border-white/70 text-white hover:border-white hover:bg-white/10",
                "text-center",
              )}
              href="/contact"
            >
              {t("getInTouch")}
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
