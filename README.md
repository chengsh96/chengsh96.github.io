# chengsh96.github.io

Personal website of Shihao Cheng — a hand-authored static site (HTML/CSS/JS,
no build step) served from GitHub Pages, with English and Chinese (`/zh`) versions.

## CI/CD

Every push and pull request to `main` runs
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **validate** — runs on pushes *and* PRs:
   - `lint:html` — [htmlhint](https://htmlhint.com/) with rules in [`.htmlhintrc`](.htmlhintrc)
   - `lint:js` — `node --check` syntax check on every file in `assets/`
   - `check:links` — verifies every local `href`/`src`/`poster` resolves to a
     real file **and** every `#anchor` points at an existing element id
   - `check:nav` — verifies the header nav is consistent: desktop and mobile
     menus match on each page, and every page's nav matches its language's
     homepage (same labels, order, and resolved destination — catches a link
     pointing at the wrong section even when the target exists)
2. **deploy** — runs only after `validate` passes, only on `main` (not PRs):
   publishes the site to GitHub Pages.

A separate, non-gating workflow
[`external-links.yml`](.github/workflows/external-links.yml) checks outbound
http(s) links weekly (and on demand via *Actions → External link check → Run
workflow*). It never blocks deploys; if a real external link is down it opens or
updates a GitHub issue. Bot-blocking hosts (LinkedIn, Scholar) that return
403/429/999 are treated as alive.

### One-time setup (required)

For the deploy job to publish, set the Pages source to GitHub Actions:

> **Repo → Settings → Pages → Build and deployment → Source → "GitHub Actions"**

Until this is changed, the site keeps using the old "Deploy from a branch"
behavior and the `deploy` job will not take effect.

## Running checks locally

```bash
npm install      # one time
npm test         # html lint + js syntax + link check
```

Or individually: `npm run lint:html`, `npm run lint:js`, `npm run check:links`,
`npm run check:nav`. (External link checking runs in CI only — it needs the
`lychee` binary.)
