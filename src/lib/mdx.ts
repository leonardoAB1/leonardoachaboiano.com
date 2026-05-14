import { compile, run } from "@mdx-js/mdx";
import type { ComponentType } from "react";
import * as runtime from "react/jsx-runtime";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";

/**
 * Compiles an MDX string with all remark/rehype plugins applied, then
 * executes it and returns a React component ready for server rendering.
 *
 * This approach bypasses the Turbopack loader limitation (function plugin
 * options cannot be serialized), by compiling MDX at server runtime using
 * @mdx-js/mdx directly.
 */
export async function compileMDX(source: string): Promise<ComponentType> {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  });

  const { default: MDXContent } = (await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  })) as { default: ComponentType };

  return MDXContent;
}
