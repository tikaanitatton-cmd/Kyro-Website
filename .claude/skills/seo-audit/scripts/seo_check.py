#!/usr/bin/env python3
"""First-pass SEO check for one HTML file or URL. Standard library only.

Usage: python3 seo_check.py <path-or-url>
Prints PASS / WARN / FAIL lines. Exit code 1 if any FAIL.
"""
import json
import re
import sys
import urllib.parse
import urllib.request
from html.parser import HTMLParser


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self._in_title = False
        self.meta = {}
        self.links = []
        self.h = []
        self._h_tag = None
        self._h_text = ""
        self.imgs = []
        self.anchors = []
        self._a = None
        self.jsonld = []
        self._in_ld = False
        self._ld = ""
        self.lang = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta[key.lower()] = a.get("content", "")
        elif tag == "link":
            self.links.append(a)
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._h_tag, self._h_text = tag, ""
        elif tag == "img":
            self.imgs.append(a)
        elif tag == "a":
            self._a = {"href": a.get("href", ""), "text": ""}
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld, self._ld = True, ""

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == self._h_tag:
            self.h.append((tag, self._h_text.strip()))
            self._h_tag = None
        elif tag == "a" and self._a is not None:
            self.anchors.append(self._a)
            self._a = None
        elif tag == "script" and self._in_ld:
            self.jsonld.append(self._ld)
            self._in_ld = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._h_tag:
            self._h_text += data
        if self._a is not None:
            self._a["text"] += data
        if self._in_ld:
            self._ld += data


def load(src):
    if re.match(r"https?://", src):
        req = urllib.request.Request(src, headers={"User-Agent": "seo-check/1.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.read().decode("utf-8", "replace")
    with open(src, encoding="utf-8") as f:
        return f.read()


def fetch_ok(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "seo-check/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status == 200
    except Exception:
        return False


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    src = sys.argv[1]
    html = load(src)
    p = Page()
    p.feed(html)
    results = []

    def add(level, msg):
        results.append((level, msg))

    # lang, viewport
    add("PASS" if p.lang else "FAIL", f"html lang: {p.lang or 'missing'}")
    add("PASS" if "viewport" in p.meta else "FAIL", "viewport meta " + ("present" if "viewport" in p.meta else "missing"))

    # title
    t = " ".join(p.title.split())
    if not t:
        add("FAIL", "title missing")
    elif not 15 <= len(t) <= 65:
        add("WARN", f"title length {len(t)} (aim 30-60): {t}")
    else:
        add("PASS", f"title ({len(t)} chars): {t}")

    # description
    d = p.meta.get("description", "").strip()
    if not d:
        add("FAIL", "meta description missing")
    elif not 70 <= len(d) <= 170:
        add("WARN", f"meta description length {len(d)} (aim 120-160)")
    else:
        add("PASS", f"meta description ({len(d)} chars)")

    # canonical
    canon = [l for l in p.links if (l.get("rel") or "").lower() == "canonical"]
    add("PASS" if canon else "WARN", "canonical link " + ("present" if canon else "missing (add once the final URL is known)"))

    # robots meta
    robots = p.meta.get("robots", "").lower()
    if "noindex" in robots:
        add("FAIL", f"robots meta contains noindex: {robots}")
    else:
        add("PASS", "no noindex directive")

    # headings
    h1s = [x for x in p.h if x[0] == "h1"]
    if len(h1s) == 1:
        add("PASS", "one h1: " + " ".join(h1s[0][1].split())[:70])
    else:
        add("FAIL" if not h1s else "WARN", f"{len(h1s)} h1 elements (want exactly 1)")
    levels = [int(x[0][1]) for x in p.h]
    skips = [(a, b) for a, b in zip(levels, levels[1:]) if b > a + 1]
    add("PASS" if not skips else "WARN", "heading order " + ("sequential" if not skips else f"skips levels {skips[:3]}"))

    # images
    missing = [i.get("src", "")[:40] for i in p.imgs if "alt" not in i]
    add("PASS" if not missing else "FAIL", f"{len(p.imgs)} images, {len(missing)} without alt attribute")
    nodim = [i for i in p.imgs if not (i.get("width") and i.get("height"))]
    add("PASS" if not nodim else "WARN", f"{len(nodim)} images without width/height (layout shift risk)")
    inline = len(re.findall(r"data:image/", html))
    add("PASS" if inline <= 2 else "WARN", f"{inline} inline base64 images (large ones slow the page)")

    # link text
    vague = [a for a in p.anchors if a["text"].strip().lower() in ("click here", "here", "read more", "more")]
    add("PASS" if not vague else "WARN", f"{len(vague)} vague link texts")
    empty = [a for a in p.anchors if not a["text"].strip() and a["href"]]
    if empty:
        add("INFO", f"{len(empty)} links with no text (fine if they wrap an image or have aria-label)")

    # open graph
    og = [k for k in ("og:title", "og:description", "og:image", "og:url") if k in p.meta]
    missing_og = [k for k in ("og:title", "og:description", "og:image", "og:url") if k not in p.meta]
    add("PASS" if not missing_og else "WARN", "open graph: " + (", ".join(og) or "none") + (f" (missing {', '.join(missing_og)})" if missing_og else ""))

    # JSON-LD
    if not p.jsonld:
        add("WARN", "no JSON-LD structured data")
    for raw in p.jsonld:
        try:
            data = json.loads(raw)
            types = data.get("@type") if isinstance(data, dict) else "list"
            add("PASS", f"JSON-LD parses, @type={types}")
            items = data if isinstance(data, list) else [data]
            for it in items:
                if not isinstance(it, dict):
                    continue
                t = it.get("@type")
                ts = t if isinstance(t, list) else [t]
                local = any(isinstance(x, str) and any(k in x for k in ("Business", "Service", "Organization", "Store", "Dealer", "Repair")) and x not in ("Service",) for x in ts)
                if local:
                    for key in ("name", "telephone"):
                        if key not in it and not (key == "telephone" and "email" in it):
                            add("WARN", f"JSON-LD {t} missing '{key}'")
                if any(k in it for k in ("aggregateRating", "review")):
                    add("INFO", "JSON-LD contains ratings/reviews: confirm they are real and visible on the page")
        except Exception as e:
            add("FAIL", f"JSON-LD does not parse: {e}")

    # robots.txt and sitemap for URLs
    if re.match(r"https?://", src):
        base = "{0.scheme}://{0.netloc}".format(urllib.parse.urlparse(src))
        add("PASS" if fetch_ok(base + "/robots.txt") else "WARN", "robots.txt " + ("found" if fetch_ok(base + "/robots.txt") else "not found"))
        add("PASS" if fetch_ok(base + "/sitemap.xml") else "WARN", "sitemap.xml " + ("found" if fetch_ok(base + "/sitemap.xml") else "not found"))
    else:
        import os
        folder = os.path.dirname(os.path.abspath(src))
        def find(name):
            cur = folder
            for _ in range(6):
                if os.path.exists(os.path.join(cur, name)):
                    return True
                nxt = os.path.dirname(cur)
                if nxt == cur:
                    break
                cur = nxt
            return False
        add("PASS" if find("robots.txt") else "WARN", "robots.txt in this folder or a parent: " + ("found" if find("robots.txt") else "not found"))
        add("PASS" if find("sitemap.xml") else "WARN", "sitemap.xml in this folder or a parent: " + ("found" if find("sitemap.xml") else "not found (add once the domain is known)"))

    for level, msg in results:
        print(f"{level:5} {msg}")
    counts = {k: sum(1 for l, _ in results if l == k) for k in ("FAIL", "WARN", "PASS")}
    print(f"\n{counts['PASS']} pass, {counts['WARN']} warn, {counts['FAIL']} fail")
    return 1 if counts["FAIL"] else 0


if __name__ == "__main__":
    sys.exit(main())
