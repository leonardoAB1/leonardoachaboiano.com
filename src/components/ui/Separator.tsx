import type { HTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/utils";

type SeparatorProps = HTMLAttributes<HTMLHRElement>;

export function Separator({
  className,
  ...props
}: SeparatorProps): ReactElement {
  return (
    <hr
      className={cn("border-0 border-t border-border-subtle", className)}
      {...props}
    />
  );
}
