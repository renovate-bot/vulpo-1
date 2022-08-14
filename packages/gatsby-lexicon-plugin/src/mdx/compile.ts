import { readFile } from "fs/promises";

import { remarkAdmonitions } from "./plugins/admonitions";
import { remarkAssets } from "./plugins/assets";
import { remarkLinks } from "./plugins/links";
import { remarkToc } from "./plugins/toc";

type CompileMdxOptions = {
  path: string;
  node: any;
  context: any;
  info: any;
};

export const compileMdx = async ({ path, node, context, info }: CompileMdxOptions) => {
  const { compile } = await import("@mdx-js/mdx");

  const { default: remarkGfm } = await import("remark-gfm");
  const { default: remarkMath } = await import("remark-math");
  const { default: remarkDirective } = await import("remark-directive");
  const { default: rehypeKatex } = await import("rehype-katex");

  const value = await readFile(path, "utf8");

  const compiled = await compile(
    { value, path },
    {
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        remarkDirective,
        remarkAdmonitions,
        remarkAssets,
        [remarkLinks, { node, context, info }],
        remarkToc,
      ],
      rehypePlugins: [rehypeKatex],
      jsx: false,
      useDynamicImport: true,
      outputFormat: "function-body",
    }
  );

  return { mdx: String(compiled), toc: compiled.data.toc };
};
