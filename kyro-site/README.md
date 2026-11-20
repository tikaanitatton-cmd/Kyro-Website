# Kyro Marketing: your original site, optimised

This is the **same design, colours and layout as your original site** (hero video, scrolling service cards, glass cards, FAQ, ad results gallery, step-by-step apply form), rebuilt so it loads fast and search engines can read it. Text was tightened for automotive businesses and new sections were added in the same style.

## What changed (and what did not)
- **Same:** every colour, font, animation, component and the apply form flow.
- **Faster:** the code is pre-compiled instead of being compiled in the visitor's browser, styles are pre-built, images and videos are separate files, and fonts are hosted on the site.
- **New pages with their own addresses** (so Google can list each one): `/services/<name>/` (6), `/industries/<name>/` (6), `/case-studies/`, `/results/`, `/apply/`, `/privacy/`, `/terms/`.
- **New sections in the original style:** "Built for automotive businesses" on the home page, industry pages (what works, offers, creative ideas, first-month plan, results, FAQ), FAQs and related links on service pages, privacy and terms, and links in the footer and menu.
- **SEO:** unique title and description per page, canonical links, social share tags, structured data (business, website, services, breadcrumbs, FAQs), `sitemap.xml`, `robots.txt`, and a readable text copy of each page's content for crawlers and no-JavaScript visitors.

## Deploy
Upload this folder (without `node_modules`) to Netlify or another static host. It needs a host that serves `folder/index.html` at `/folder/`, which Netlify does. `_headers` sets caching and security headers.

## Before you launch
1. Send one real application and confirm the email arrives (form key is in `src/app.jsx`, search for `access_key`).
2. Confirm "13+ clients", "5×" and "$35K+": they are carried over unchanged.
3. Have the privacy and terms text reviewed (`build/content.py`, `LEGAL`).
4. In Google Analytics (`G-RB5BGNSFRM`) mark the `generate_lead` event as a conversion. Analytics loads on first scroll/click or after 5 seconds.
5. Add the site in Search Console and submit `https://kyromarketing.net/sitemap.xml`.
6. If you add another tracking script (Meta Pixel), add its domains to the Content-Security-Policy in `build/build.py`.

## Editing
- Page text for services, industries, case studies, FAQs and legal pages: `build/content.py`.
- Layout and components: `src/app.jsx`. Styles: `src/custom.css`.
- Rebuild (needs Node and Python 3 with Pillow):

      npm install
      npm run build

  This compiles the app (`js/app.js`), the styles (`css/site.css`), `js/data.js`, and all the page shells and the sitemap.

## Measured (Lighthouse, local test with compression, mobile settings)
| | Original design as it was | This build |
|---|---|---|
| Performance (home) | 25 | 98 |
| Performance (industry page) | n/a | 99 |
| Accessibility | 93 | 100 |
| Best practices | 96 | 100 |
| SEO | 100 | 100 |
Desktop home: 34 before, 100 now. These are lab numbers from a local server, not a live host.
