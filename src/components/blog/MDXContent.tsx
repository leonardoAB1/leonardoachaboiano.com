import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MDXContentProps {
  children: ReactNode;
  className?: string;
}

export function MDXContent({
  children,
  className,
}: MDXContentProps): ReactElement {
  return (
    <article
      className={cn(
        "max-w-none",
        // Headings
        "[&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-1 sm:[&_h2]:text-3xl",
        "[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-ink-1 sm:[&_h3]:text-2xl",
        // Paragraphs
        "[&_p]:mb-6 [&_p]:leading-8 [&_p]:text-ink-2",
        // Links
        "[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-brand-dim",
        // Lists
        "[&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-2 [&_ul_li]:leading-7 [&_ul_li]:text-ink-2",
        "[&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mb-2 [&_ol_li]:leading-7 [&_ol_li]:text-ink-2",
        // Strong / em
        "[&_strong]:font-semibold [&_strong]:text-ink-1",
        "[&_em]:italic [&_em]:text-ink-2",
        // Inline code
        "[&_:not(pre)>code]:rounded [&_:not(pre)>code]:border [&_:not(pre)>code]:border-border [&_:not(pre)>code]:bg-surface-1 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:text-brand",
        // Code blocks
        "[&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface-1 [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-6",
        // Blockquotes
        "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink-3",
        // Horizontal rule
        "[&_hr]:my-10 [&_hr]:border-border",
        // Tables
        "[&_table]:mb-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border [&_th]:border-border [&_th]:bg-surface-1 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink-1",
        "[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2 [&_td]:text-ink-2",
        className,
      )}
    >
      {children}
    </article>
  );
}
