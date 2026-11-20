---
name: seo-audit
description: Audit and improve a website's search engine optimisation (SEO), especially small local-business sites. Use when the user asks about SEO, Google ranking, "why can't people find my site", meta titles and descriptions, structured data or JSON-LD, sitemap or robots.txt, Core Web Vitals, local SEO, or a Google Business Profile, or wants a site checked before launch. Runs a scripted check of the HTML, then reports verified findings and prioritised fixes.
---

# SEO audit

Goal: find what stops a site being crawled, understood or trusted by search engines, fix the cheap wins, and be honest about what cannot be guaranteed. Never promise a ranking. Never invent business facts (reviews, awards, years in business, prices) to improve SEO.

## Workflow

1. **Inspect first.** Find the site's HTML files (or the live URL) and read the real content, business details and any structured data already present.
2. **Run the scripted check.** `python3 scripts/seo_check.py <file-or-url>` prints each check as PASS, WARN or FAIL. Treat it as a first pass, not a verdict.
3. **Review by hand** the things a script cannot judge (see "Manual review").
4. **Fix** what is in scope: edit titles, descriptions, headings, alt text, JSON-LD, robots.txt, sitemap. Use only verified information.
5. **Re-run** the script and report before/after.
6. **Report** using the format at the end.

## What search engines need

**Crawlable**
- Every page reachable through plain `<a href>` links; no key content only inside images or script-rendered text.
- `robots.txt` that does not block the site; a `sitemap.xml` listing real pages, referenced from robots.txt.
- HTTPS, no broken links, one canonical URL per page (`<link rel="canonical">`).

**Understandable**
- One unique `<title>` per page, about 50-60 characters, leading with what the page is and where (for example "Car detailing in Melbourne | CS Detailing").
- One `<meta name="description">` per page, about 120-160 characters, written for people, including the call to action.
- Exactly one `<h1>`; `h2`/`h3` follow in order; headings describe the content.
- `<html lang="en-AU">` (match the audience), viewport meta tag.
- Meaningful `alt` text on content images; empty `alt=""` on decorative ones.
- Descriptive link text ("View packages"), not "click here".
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) so shared links look right.

**Structured data (JSON-LD)**
- Local businesses: `LocalBusiness` (or a subtype such as `AutomotiveBusiness`) with `name`, `telephone`, `areaServed`, `url`, `sameAs` (social profiles), and `address` only if a real address is public.
- Include `openingHours`, `priceRange`, `aggregateRating`, `review` only when the facts are real and also visible on the page. Marking up invented reviews breaks Google's rules.
- Validate the JSON parses; check it against the visible page.

**Fast and usable (Core Web Vitals)**
- LCP under 2.5 s, CLS under 0.1, INP under 200 ms (Google's "good" thresholds).
- Serve modern image formats (WebP/AVIF) at the displayed size, with `width`/`height` set, `loading="lazy"` below the fold, a preloaded hero image, preloaded critical fonts, `font-display: swap`.
- Mobile-first layout; no horizontal scroll; tap targets at least 44 px.
- Measure, do not guess: use Lighthouse or Playwright timings and report measured numbers only.

**Local SEO (outside the HTML)**
- Claim and complete the Google Business Profile: same business name, address or service area, phone and hours as the website.
- Keep name, address and phone identical everywhere (NAP consistency).
- Ask real customers for reviews and reply to them. Never buy or fake reviews.
- Create service pages that name the service and the area; one page per distinct service beats one page for everything.

## Manual review (things the script cannot judge)

- Does each page's main text answer what a searcher would actually type? Are the services and area named in plain words?
- Is the title/description distinct from other pages and accurate to the content?
- Is there enough real content? Thin pages rarely rank; do not pad with filler.
- Does the visible business information (name, phone, area) match the structured data exactly?
- Are there duplicate pages (www vs non-www, http vs https, trailing slashes)?

## Report format

1. **Summary**: one or two sentences with an overall state (Good / Needs work / Critical).
2. **Fixed**: what changed and why, with before/after where useful.
3. **Still needs doing** by priority: Critical (blocks indexing), High, Medium, Low. Say which items need the owner (Google Business Profile, domain, real reviews, verified details).
4. **Measured results**: only numbers you actually measured, with the method.
5. **Caveats**: rankings take weeks to months and cannot be guaranteed.

## Don'ts

- Do not keyword-stuff, hide text, or add doorway pages.
- Do not fabricate reviews, ratings, awards, addresses or prices.
- Do not claim a performance or ranking number you did not measure.
- Do not block crawlers (`Disallow: /`) on a site meant to be found; check before launch that a staging `noindex` is removed.
