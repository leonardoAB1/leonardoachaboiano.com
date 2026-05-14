"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
}

export function TagFilter({ tags }: TagFilterProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("tag");

  function setTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setTag(null)}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium transition-colors",
          "border border-border bg-surface-1 text-ink-2",
          "hover:border-brand hover:text-brand",
          !selected && "ring-2 ring-brand ring-offset-1 ring-offset-surface-0",
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          type="button"
          key={tag}
          onClick={() => setTag(tag)}
          className={cn(
            "rounded-full transition-colors",
            selected === tag &&
              "ring-2 ring-brand ring-offset-1 ring-offset-surface-0",
          )}
        >
          <Badge tone={selected === tag ? "brand" : "neutral"}>{tag}</Badge>
        </button>
      ))}
    </div>
  );
}
