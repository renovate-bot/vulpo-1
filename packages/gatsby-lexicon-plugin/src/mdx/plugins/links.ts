import * as path from "path";
import type { Plugin } from "unified";

export const remarkLinks: Plugin = ({ node: gNode, context, info }) => {
  return async (tree, file, done) => {
    const { visit } = await import("unist-util-visit");
    const { default: isRelativeUrl } = await import("is-relative-url");

    let count = 0;
    visit(tree, (node: any) => {
      if (node.type !== "link") return;
      const data = node.data || (node.data = {});

      if (!isRelativeUrl(node.url)) {
        data.hName = "ExternalLink";
        return;
      }

      count++;
      const href = path.resolve(gNode.absolutePath, node.url);
      const query = { filter: { absolutePath: { eq: href } } };
      context.nodeModel.findOne({ type: "LexiconArticle", query }).then((page: any) => {
        if (!page) {
          file.fail(`cannot resolve internal link ${href}`);
        } else {
          const type = info.schema.getType("LexiconArticle");
          type
            .getFields()
            ["url"].resolve(page, {}, context, {})
            .then((result: any) => {
              node.hName = "Link";
              node.url = result;
              if (--count === 0) {
                done();
              }
            });
        }
      });
    });

    if (!count) done();
  };
};
