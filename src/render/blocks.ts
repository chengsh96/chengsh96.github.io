import type { Block, Locale } from "../content/schema.js";
import { asset, esc, escUrl } from "./html.js";

// Tracks image order across blocks so the first image on the page stays eager
// (LCP) and the rest are lazy-loaded.
type ImgState = { n: number };

// Render one detail-page content block to HTML for a locale. `rootPath` is the
// page's site-root-relative path, used to resolve media src.
export function renderBlock(block: Block, locale: Locale, rootPath: string, img: ImgState): string {
  switch (block.kind) {
    case "paragraph":
      return `<p class="${block.cls ?? "projDesc"}">${block.text[locale]}</p>`;

    case "heading":
      return `<h3 class="u-heading-tight">${esc(block.text[locale])}</h3>`;

    case "list":
      return `<ul class="projList">\n${block.items
        .map((it) => `<li>${it[locale]}</li>`)
        .join("\n")}\n</ul>`;

    case "pills":
      return `<div class="pills u-mt-10">\n${block.items
        .map((it) => `<span class="pill">${esc(it[locale])}</span>`)
        .join("\n")}\n</div>`;

    case "linkRow":
      return `<div class="linkRow">\n${block.links
        .map(
          (l) =>
            `<a class="btn" href="${escUrl(l.href)}" rel="noopener" target="_blank">${esc(l.label[locale])}</a>`,
        )
        .join("\n")}\n</div>`;

    case "mediaGrid":
      return `<div class="mediaGrid">\n${block.items
        .map((m) => {
          const cap = m.caption
            ? `\n<figcaption class="mediaCaption">${m.caption[locale]}</figcaption>`
            : "";
          const lazy = img.n++ === 0 ? "" : 'loading="lazy" ';
          return `<figure class="mediaItem">\n<img ${lazy}width="${m.w}" height="${m.h}" alt="${esc(m.alt[locale])}" src="${asset(m.image, rootPath)}"/>${cap}\n</figure>`;
        })
        .join("\n")}\n</div>`;

    case "hr":
      return "<hr/>";

    case "raw":
      return block.html[locale];
  }
}

export function renderBlocks(blocks: Block[], locale: Locale, rootPath: string): string {
  const img: ImgState = { n: 0 };
  return blocks.map((b) => renderBlock(b, locale, rootPath, img)).join("\n");
}
