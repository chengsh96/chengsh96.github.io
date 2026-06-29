# chengsh96.github.io

Personal website of Shihao Cheng — a static site served from GitHub Pages, with
English and Chinese (`/zh`) versions. The HTML is **generated from a shared,
typed bilingual content model** so the two languages cannot drift apart.

## Content architecture

All user-visible content lives in a single typed model under [`src/`](src/);
the committed `.html` files are **generated output** — edit the content, not the
HTML.

```
src/
  content/   schema.ts · routes.ts (routes + nav) · site.ts · projects.ts ·
             news.ts · experience.ts · education.ts · journey.ts ·
             detail/<slug>.<locale>.html
  lib/       i18n.ts · localized.ts (nav builder, language switcher, canonical/og/hreflang)
  render/    html.ts · layout.ts · home.ts · projects-index.ts
scripts/     build.ts (generator) · check-content-parity.ts
```

- Every user-visible string is a `{ en, zh }` field; components read
  `field[locale]` (never `if (locale === "zh") …`). Structural data (id, slug,
  url, image, dates, tags) is shared, not localized.
- [`routes.ts`](src/content/routes.ts) is the single source of truth for routes
  + header nav; **nav, language switcher, SEO `<head>`, and `sitemap.xml` are all
  derived from it.** Projects/news/experience/education are single shared lists.
- Project **detail** bodies are long-form and bespoke, so each is kept as a
  verbatim bilingual snapshot in `src/content/detail/<slug>.<locale>.html` and
  wrapped with the shared head/nav. Parity is still enforced (both files must
  exist and be non-empty).
- `npm run build` regenerates all pages in place. `npm run build:check` (run in
  CI) fails if the committed HTML doesn't match the model — so a hand-edit or a
  drifted locale can't slip through. Output stays 100% static; URLs and design
  are unchanged.

To change copy: edit the relevant `src/content/*` file (or a `detail/*.html`
body), run `npm run build`, and commit the regenerated HTML.

## CI/CD

Every push and pull request to `main` runs
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **validate** — runs on pushes *and* PRs:
   - `typecheck` — `tsc --noEmit` over the content model
   - `content:check` — every localized field has non-empty `en` **and** `zh`;
     routes/nav/collections are internally consistent; ids unique; both detail
     body files exist per project (the core EN/ZH anti-drift gate)
   - `build:check` — committed HTML matches what the content model generates
   - `lint:html` — [htmlhint](https://htmlhint.com/) with rules in [`.htmlhintrc`](.htmlhintrc)
   - `lint:js` — `node --check` syntax check on every file in `assets/`
   - `check:links` — verifies every local `href`/`src`/`poster` resolves to a
     real file **and** every `#anchor` points at an existing element id
   - `check:nav` — verifies the header nav is consistent: desktop and mobile
     menus match on each page, and every page's nav matches its language's
     homepage (same labels, order, and resolved destination — catches a link
     pointing at the wrong section even when the target exists)
   - `check:seo` — every page has a title, meta description, `og:title`/
     `og:description`/`og:url`, a canonical link, viewport, and exactly one
     `<h1>`; canonical and `og:url` must equal the URL derived from the file
     path (catches copy-pasted pages pointing at the wrong URL)
   - `check:i18n` — every English page has a `zh/` mirror and vice versa, and
     each page's `<html lang>` is correct (`en` / `zh-CN`)
   - `check:sitemap` — `sitemap.xml`/`robots.txt` are in sync with the pages
     (regenerate with `npm run gen:sitemap`)
2. **deploy** — runs only after `validate` passes, only on `main` (not PRs):
   publishes the site to GitHub Pages.

Two **non-gating** workflows never block deploys — they report only:

- [`external-links.yml`](.github/workflows/external-links.yml) — checks outbound
  http(s) links weekly (and on demand). If a real external link is down it opens
  or updates a GitHub issue. Bot-blocking hosts (LinkedIn, Scholar) that return
  403/429/999 are treated as alive.
- [`quality.yml`](.github/workflows/quality.yml) — accessibility ([pa11y],
  WCAG2AA) and [Lighthouse CI] (performance/SEO/best-practices) audits on PRs,
  weekly, and on demand. Results appear in the run logs, uploaded artifacts, and
  Lighthouse public-storage links. Tune scope in [`.pa11yci.json`] and
  [`.lighthouserc.json`].

[pa11y]: https://pa11y.org/
[Lighthouse CI]: https://github.com/GoogleChrome/lighthouse-ci
[`.pa11yci.json`]: .pa11yci.json
[`.lighthouserc.json`]: .lighthouserc.json

`sitemap.xml` includes `hreflang` alternates linking each EN page to its ZH
mirror, which helps search engines serve the right language.

### One-time setup (required)

For the deploy job to publish, set the Pages source to GitHub Actions:

> **Repo → Settings → Pages → Build and deployment → Source → "GitHub Actions"**

Until this is changed, the site keeps using the old "Deploy from a branch"
behavior and the `deploy` job will not take effect.

## Running checks locally

```bash
npm install      # one time
npm run build    # regenerate HTML from the content model
npm test         # typecheck, content:check, build:check, html, js, links, nav, seo, i18n, sitemap
```

Individual scripts: `build`, `build:check`, `typecheck`, `content:check`,
`lint:html`, `lint:js`, `check:links`, `check:nav`, `check:seo`, `check:i18n`,
`check:sitemap`, plus `gen:sitemap` to rebuild `sitemap.xml`/`robots.txt`.
(External-link, accessibility, and Lighthouse checks run in CI only — they need
extra binaries: `lychee`, Chromium.)
