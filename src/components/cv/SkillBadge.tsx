import type { ReactElement } from "react";
import { Badge } from "@/components/ui/Badge";

interface SkillBadgeProps {
  label: string;
}

export function SkillBadge({ label }: SkillBadgeProps): ReactElement {
  return <Badge tone="neutral">{label}</Badge>;
}
