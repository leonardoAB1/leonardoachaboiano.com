"use client";

import {
  LayoutGroup,
  m,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  type ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useTypewriter } from "@/hooks/useTypewriter";
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

// Parallax tuning - the background plate drifts less than the foreground
// cutout, which reads as depth (the closer plane moves faster as the page
// scrolls past the hero). Distances are deliberately small: brand guidance
// is subtle motion only, not a dramatic effect. The _REDUCED pair scales the
// same effect down under prefers-reduced-motion rather than disabling it,
// following the precedent set in GlobeVisualization.
const PARALLAX_BG_PX = 18;
const PARALLAX_PERSON_PX = 42;
const PARALLAX_BG_PX_REDUCED = 8;
const PARALLAX_PERSON_PX_REDUCED = 18;
const PARALLAX_BG_SCALE = 1.06;
const PARALLAX_PERSON_SCALE = 1.12;

// m.create() wraps any React component to accept Framer Motion props (layout,
// animate, etc.). Next.js Link forwards its ref, so this works correctly.
const MotionLink = m.create(Link);

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
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  // Raw array read (not t()) because this is a list of phrases, not a single
  // translated string - same t.raw precedent used for Timeline entries in
  // src/lib/timeline-content.ts.
  const identities = t.raw("identities") as string[];
  const { text: typedText } = useTypewriter(identities, prefersReducedMotion);

  // scrollYProgress goes 0 -> 1 as the hero scrolls from "just entered the
  // top of the viewport" to "fully scrolled past" - i.e. exactly the range
  // during which a top-of-page hero is visible and scrolling away.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgMax = prefersReducedMotion ? PARALLAX_BG_PX_REDUCED : PARALLAX_BG_PX;
  const personMax = prefersReducedMotion
    ? PARALLAX_PERSON_PX_REDUCED
    : PARALLAX_PERSON_PX;
  const bgY = useTransform(scrollYProgress, [0, 1], [0, bgMax]);
  const personY = useTransform(scrollYProgress, [0, 1], [0, personMax]);
  // Scale must grow from 1 (true native size, matching the pre-parallax
  // photo exactly) rather than being a constant - a fixed scale would zoom
  // the image at rest, before any scrolling happens.
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, PARALLAX_BG_SCALE]);
  const personScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, PARALLAX_PERSON_SCALE],
  );

  // While the hero dominates the viewport, tint the page scrollbar in hero
  // colors (see .over-hero in globals.css) so the gutter doesn't cut a cream
  // strip into the teal panel - the scrollbar counterpart of the navbar's
  // overHero color switch. IntersectionObserver keeps this passive; the class
  // lives on <html> because that element owns the root scrollbar.
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.classList.toggle(
          "over-hero",
          entry.intersectionRatio >= 0.55,
        );
      },
      { threshold: [0.55] },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      // Route changes unmount the hero without a final observer callback.
      document.documentElement.classList.remove("over-hero");
    };
  }, []);

  return (
    <Section className="relative flex min-h-svh flex-col overflow-hidden bg-brand pb-12 pt-[calc(3.5rem+2rem)] sm:pb-16 sm:pt-[calc(3.5rem+2.5rem)] lg:justify-center">
      {/* Portrait — sky-focused on mobile, right-anchored on desktop. Two
          layers parallax at different rates for a depth cue: the background
          plate drifts less, the person cutout drifts more, both driven by
          the same heroRef scroll progress. Each inner layer is scaled up
          slightly beyond its absolute-inset-0 box so the translate never
          exposes an edge gap - scale (not a taller box) keeps object-cover's
          crop framing identical to a static image at rest. */}
      <div
        ref={heroRef}
        className="absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <m.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
          <Image
            src="/images/portrait-hero-background.webp"
            alt=""
            fill
            className="object-cover object-top lg:object-right-top"
            priority
            quality={75}
            sizes="100vw"
          />
        </m.div>
        <m.div
          style={{ y: personY, scale: personScale }}
          className="absolute inset-0"
        >
          <Image
            src="/images/portrait-hero-person.webp"
            alt=""
            fill
            className="object-cover object-top lg:object-right-top"
            priority
            quality={75}
            sizes="100vw"
          />
        </m.div>
      </div>

      {/* Text content — in normal flow, stacks above absolute layers via DOM order */}
      <LayoutGroup>
        <Container
          className={cn(
            "relative max-w-7xl",
            breakpoint === "lg" ? "block" : "flex flex-1 flex-col",
          )}
        >
          <m.div
            className={cn(
              "flex flex-col gap-8 max-w-xl",
              breakpoint !== "lg" && "flex-1",
            )}
            initial="hidden"
            animate="show"
            variants={container}
          >
            <m.div variants={item}>
              <Eyebrow className="text-white/70">{tCommon("role")}</Eyebrow>
            </m.div>
            <m.div variants={item}>
              {/* The animated span is decorative (aria-hidden): it re-renders
                  every few hundred ms as it types/deletes, which would spam
                  assistive tech if it were the H1's accessible name. The
                  sr-only span instead gives the H1 one stable, readable list
                  of every identity - the accessible equivalent of what the
                  animation shows visually over time. */}
              <Heading
                as="h1"
                size="xl"
                className="break-words text-white [hyphens:auto] text-[clamp(2rem,5vw,3rem)] leading-tight sm:text-[clamp(2rem,5vw,3rem)]"
              >
                <span aria-hidden="true">
                  {typedText}
                  <span className="typewriter-cursor" />
                </span>
                <span className="sr-only">{identities.join(". ")}.</span>
              </Heading>
            </m.div>
            <m.div variants={item}>
              <Text className="text-white/80" size="lg">
                {t("intro")}
              </Text>
            </m.div>

            {/* Layout mover: owns FLIP position animation only.
                No variants/y so the animate system cannot fight FLIP's translateY. */}
            <m.div
              layout
              layoutDependency={breakpoint}
              transition={{ layout: layoutTransition }}
              className={cn(breakpoint !== "lg" && "mt-auto")}
            >
              {/* Entrance animator: owns the stagger opacity+y mount animation.
                  No layout prop so it never interferes with FLIP. */}
              <m.div
                variants={item}
                className={cn(
                  "flex",
                  breakpoint === "mobile"
                    ? "flex-col gap-3"
                    : "flex-row items-center gap-4",
                )}
              >
                {/* Each button keeps layout for the flex-col → flex-row reflow at 640px. */}
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
              </m.div>
            </m.div>
          </m.div>
        </Container>
      </LayoutGroup>
    </Section>
  );
}
