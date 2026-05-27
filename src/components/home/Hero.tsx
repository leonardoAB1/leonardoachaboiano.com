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
  hidden: { opacity: 0, scale: 1.03 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

export function Hero(): ReactElement {
  const t = useTranslations("Home.Hero");
  const tCommon = useTranslations("Common");

  return (
    <Section className="flex min-h-svh flex-col justify-center pb-16 pt-[calc(3.5rem+2rem)] sm:pb-20 sm:pt-[calc(3.5rem+2.5rem)]">
      <Container className="max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <motion.div
            className="flex flex-col gap-8"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <motion.div variants={item}>
              <Eyebrow>{tCommon("role")}</Eyebrow>
            </motion.div>
            <motion.div variants={item}>
              <Heading
                as="h1"
                size="xl"
                className="break-words [hyphens:auto] text-[clamp(2rem,5vw,3rem)] leading-tight sm:text-[clamp(2rem,5vw,3rem)]"
              >
                {t("heading")}
              </Heading>
            </motion.div>
            <motion.div variants={item}>
              <Text className="text-ink-2" size="lg">
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
                  "text-center",
                )}
                href="/cv"
              >
                {t("viewCv")}
              </Link>
              <Link
                className={cn(
                  buttonClasses({ size: "lg", variant: "secondary" }),
                  "text-center",
                )}
                href="/contact"
              >
                {t("getInTouch")}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-2xl lg:mx-0 lg:max-w-none"
            aria-hidden="true"
            initial="hidden"
            animate="show"
            variants={portraitVariants}
          >
            <Image
              src="/images/portrait-hero.webp"
              alt=""
              fill
              className="object-cover object-[60%_top]"
              priority
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoKAAcAAoBCJYwCdADcEZKsjAD4VsSOg4Zt1QoIdZCBYmuVjYAAAA=="
              sizes="(max-width: 1024px) 80vw, 400px"
            />
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
