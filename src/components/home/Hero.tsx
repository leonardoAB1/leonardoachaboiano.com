"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ReactElement, useEffect, useLayoutEffect, useState } from "react";
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

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const layoutTransition = {
  type: "spring",
  bounce: 0.15,
  duration: 0.5,
} as const;

// motion() wraps any React component to accept Framer Motion props (layout,
// animate, etc.). Next.js Link forwards its ref, so this works correctly.
const MotionLink = motion(Link);

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "sm" | "lg">(
    "mobile",
  );

  useIsomorphicLayoutEffect(() => {
    const smMq = window.matchMedia("(min-width: 640px)");
    const lgMq = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (lgMq.matches) setBreakpoint("lg");
      else if (smMq.matches) setBreakpoint("sm");
      else setBreakpoint("mobile");
    };

    update();
    smMq.addEventListener("change", update);
    lgMq.addEventListener("change", update);
    return () => {
      smMq.removeEventListener("change", update);
      lgMq.removeEventListener("change", update);
    };
  }, []);

  return breakpoint;
}

export function Hero(): ReactElement {
  const t = useTranslations("Home.Hero");
  const tCommon = useTranslations("Common");
  const breakpoint = useBreakpoint();

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

          {/* layout + layoutDependency animate the group position when the
              container switches from flex to block at lg, and the buttons
              move from the bottom of the viewport to below the text. */}
          <motion.div
            variants={item}
            layout
            layoutDependency={breakpoint}
            transition={{ layout: layoutTransition }}
            className={cn(
              "flex",
              breakpoint === "mobile"
                ? "flex-col gap-3"
                : "flex-row items-center gap-4",
              breakpoint !== "lg" && "mt-auto",
            )}
          >
            {/* Each button gets layout so Framer Motion can FLIP their
                individual positions when switching between flex-col and flex-row. */}
            <MotionLink
              layout
              layoutDependency={breakpoint}
              transition={{ layout: layoutTransition }}
              className={cn(
                buttonClasses({ size: "lg", variant: "primary" }),
                "bg-white text-brand hover:bg-white/90",
                "text-center",
              )}
              href="/cv"
            >
              {t("viewCv")}
            </MotionLink>
            <MotionLink
              layout
              layoutDependency={breakpoint}
              transition={{ layout: layoutTransition }}
              className={cn(
                buttonClasses({ size: "lg", variant: "secondary" }),
                "border-white/70 text-white hover:border-white hover:bg-white/10",
                "text-center",
              )}
              href="/contact"
            >
              {t("getInTouch")}
            </MotionLink>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
