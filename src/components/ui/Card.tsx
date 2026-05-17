import type { HTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;
type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function Card({ className, ...props }: CardProps): ReactElement {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface-0 p-6 shadow-sm shadow-black/5",
        "transition-[colors,box-shadow] duration-200 dark:shadow-black/20",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps): ReactElement {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: CardTitleProps): ReactElement {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-ink-1",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: CardDescriptionProps): ReactElement {
  return (
    <p className={cn("text-sm leading-6 text-ink-3", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: CardProps): ReactElement {
  return <div className={cn("mt-5", className)} {...props} />;
}
