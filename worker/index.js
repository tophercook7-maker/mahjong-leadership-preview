/**
 * maureenacahill.com on Cloudflare.
 *
 * The only hard requirement of the move off GitHub Pages was that the URL
 * shape survive it. Two things are already in the wild and must keep
 * returning 200, not a redirect:
 *
 *   /book.html etc. — every canonical tag, the sitemap, and what Google has
 *                     actually indexed. Cloudflare Pages 308s these to
 *                     extensionless, which would have moved every indexed
 *                     URL three weeks before the book launch.
 *   /resources      — the permanent reader link she hands out
 *                     (/resources?access=reader). GitHub Pages served this
 *                     extensionless for free.
 *
 * So html_handling is "none" — Cloudflare rewrites nothing behind our back —
 * and the mapping lives here, explicitly, where it can be read and tested.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const tryAsset = async (pathname) => {
      const u = new URL(url);
      u.pathname = pathname;
      const res = await env.ASSETS.fetch(new Request(u, request));
      return res.status === 404 ? null : res;
    };

    let path = url.pathname;
    if (path.endsWith("/")) path += "index.html";

    // 1. Exact file — covers /book.html and every asset.
    let res = await tryAsset(path);
    if (res) return res;

    // 2. Extensionless — /resources becomes /resources.html.
    const last = path.split("/").pop();
    if (last && !last.includes(".")) {
      res = await tryAsset(path + ".html");
      if (res) return res;
    }

    return (
      (await tryAsset("/404.html")) ||
      new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      })
    );
  },
};
