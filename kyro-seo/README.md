# Kyro Marketing: SEO-optimised static site

Static HTML, inline CSS, two small JS files, self-hosted fonts. No framework, no build step needed to host it.

## Deploy
Upload this whole folder to Netlify (drag and drop works) or any static host. Pages live at clean URLs such as `/services/meta-ads/`, so use a host that serves `folder/index.html` (Netlify, Vercel, Cloudflare Pages, GitHub Pages all do). Opening `index.html` straight from disk shows the home page only; links to other pages need a web server.

## Before you launch (checklist)
1. **Form key**: the apply form uses the existing Web3Forms key in `build/content.py` (`web3forms_key`). Send one real test application and confirm the email arrives.
2. **Confirm the numbers**: "13+ clients", "5×" and "$35K+" are carried over unchanged from the old site. Keep them only if they are still true.
3. **Privacy policy and terms** are plain-English drafts. Have them reviewed before relying on them.
4. **Google Analytics** (`G-RB5BGNSFRM`) is on every page except the 404, and the apply form fires a `generate_lead` event on `/thank-you/`. Mark that event as a conversion in GA4, and add the Meta Pixel / Google Ads tag if you use them.
5. **Search Console**: add the property, submit `https://kyromarketing.net/sitemap.xml`, and request indexing of the home page.
6. **Google Business Profile** (if you have a Victoria address or service area) and consistent name, email and social links everywhere.
7. Replace the social share image (`assets/og-image.jpg`) with a branded design if you like (1200×630).
8. Add real client testimonials or logos only with permission, then they can be added to the home page.

## Editing
- Copy lives in `build/content.py`; page templates are in `build/build.py`; the readable CSS and JS are in `src/`.
- After any edit run:

      python3 build/build.py      # needs Python 3 and Pillow

  It regenerates every page, minifies the CSS (inlined into each page) and JS, adds a version tag to the script URLs, and rewrites `sitemap.xml`, `robots.txt` and `_headers`.

## Performance and security notes
- Lighthouse (local, mobile settings): Performance, Accessibility, Best Practices and SEO all 100 on the home, an industry and the results page.
- Google Analytics loads on the first scroll, click or key press, or after 5 seconds, so it doesn't slow the first load. Very short visits with no interaction may not be counted.
- `_headers` (Netlify) sets caching and a Content-Security-Policy. If you add another third-party script, such as the Meta Pixel, add its domains to the policy in `build/build.py`, or it will be blocked.

## What is on the site
- Home, 6 service pages, 6 industry pages (detailing, car wash, tinting, ceramic coating, PPF, headlight restoration), case studies, ad results (real Meta screenshots), apply, thank-you, privacy, terms, 404.
- Each page has a unique title, description, canonical URL, Open Graph and Twitter tags, breadcrumbs and JSON-LD (Organization, WebSite, Service, BreadcrumbList, FAQPage).
