import type { HTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span";
}

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "lg" | "md";
}

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg";
}

const headingSizeClasses = {
  xl: "text-4xl leading-tight sm:text-6xl sm:leading-tight",
  lg: "text-3xl leading-tight sm:text-4xl sm:leading-tight",
  md: "text-2xl leading-tight sm:text-3xl sm:leading-tight",
} as const;

const textSizeClasses = {
  sm: "text-sm leading-6",
  md: "text-base leading-7",
  lg: "text-lg leading-8",
} as const;

export function Eyebrow({
  as: Tag = "p",
  className,
  ...props
}: EyebrowProps): ReactElement {
  return (
    <Tag
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.24em] text-brand",
        className,
      )}
      {...props}
    />
  );
}

export function Heading({
  as: Tag = "h2",
  size = "lg",
  className,
  ...props
}: HeadingProps): ReactElement {
  return (
    <Tag
      className={cn(
        "max-w-3xl font-semibold tracking-tight text-ink-1",
        headingSizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

export function Text({
  size = "md",
  className,
  ...props
}: TextProps): ReactElement {
  return (
    <p
      className={cn("max-w-2xl text-ink-3", textSizeClasses[size], className)}
      {...props}
    />
  );
}
