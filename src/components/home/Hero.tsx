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

export function Hero(): ReactElement {
  const t = useTranslations("Home.Hero");
  const tCommon = useTranslations("Common");

  return (
    <Section className="relative flex min-h-svh flex-col overflow-hidden bg-[#02777C] pb-16 pt-[calc(3.5rem+2rem)] sm:pb-20 sm:pt-[calc(3.5rem+2.5rem)] lg:justify-center">
      {/* Portrait — sky-focused on mobile, right-anchored on desktop */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Mobile: object-top frames the sky above the face */}
        <Image
          src="/images/portrait-hero.webp"
          alt=""
          fill
          className="object-cover object-top lg:hidden"
          priority
          quality={75}
          sizes="100vw"
        />
        {/* Desktop: face anchored to the right */}
        <Image
          src="/images/portrait-hero.webp"
          alt=""
          fill
          className="hidden object-cover object-right-top lg:block"
          priority
          quality={75}
          sizes="100vw"
        />
      </div>

      {/* Text content — in normal flow, stacks above absolute layers via DOM order */}
      <Container className="relative flex flex-1 flex-col max-w-7xl lg:block">
        <motion.div
          className="flex flex-1 flex-col gap-8 max-w-xl lg:flex-none"
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
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mt-auto lg:mt-0"
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
