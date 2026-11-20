#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Writes the page shells (SEO head, structured data, crawlable text), js/data.js, sitemap, robots and headers.
The visual site itself is the React app in src/app.jsx (compiled by tools/build.sh)."""
import json, os, sys, html as H
sys.path.insert(0, os.path.dirname(__file__))
from content import *

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
URL = SITE['url']; E = H.escape
RESULTS = json.load(open(os.path.join(os.path.dirname(__file__), 'ad_results.json'), encoding='utf-8'))
IND_BY = {i['slug']: i for i in INDUSTRIES}

def write(rel, text):
    full = os.path.join(ROOT, rel); os.makedirs(os.path.dirname(full) or ROOT, exist_ok=True)
    open(full, 'w', encoding='utf-8').write(text)

def jsonld(o): return '<script type="application/ld+json">' + json.dumps(o, ensure_ascii=False, separators=(',', ':')) + '</script>'
def faq_schema(items): return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}
def crumbs(trail): return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": URL + p} for i, (n, p) in enumerate(trail)]}

ORG = {"@context": "https://schema.org", "@type": "ProfessionalService", "@id": URL + "/#org", "name": SITE['name'], "url": URL + "/",
       "logo": URL + "/assets/icon-512.png", "image": URL + "/assets/og-image.jpg", "email": SITE['email'], "telephone": SITE['phone'],
       "description": "Performance advertising for automotive businesses: Meta, Google and TikTok ads for car detailing, car wash, window tinting, ceramic coating, PPF and headlight restoration businesses.",
       "areaServed": {"@type": "Country", "name": "Australia"}, "address": {"@type": "PostalAddress", "addressRegion": "VIC", "addressCountry": "AU"},
       "sameAs": [SITE['facebook'], SITE['instagram']],
       "contactPoint": {"@type": "ContactPoint", "contactType": "sales", "email": SITE['email'], "telephone": SITE['phone'], "areaServed": "AU", "availableLanguage": "en"},
       "serviceType": "Digital advertising for automotive businesses",
       "knowsAbout": ["Meta ads", "Google Ads", "TikTok ads", "Car detailing marketing", "Window tinting marketing", "Ceramic coating marketing", "Paint protection film marketing"]}
WEBSITE = {"@context": "https://schema.org", "@type": "WebSite", "@id": URL + "/#website", "url": URL + "/", "name": SITE['name'], "publisher": {"@id": URL + "/#org"}, "inLanguage": "en-AU"}

# ------------------------------------------------------------------ crawlable text (same copy the app shows)
def ul(items): return '<ul>' + ''.join(f'<li>{E(x)}</li>' for x in items) + '</ul>'
def faq_html(items): return '<h2>Frequently asked questions</h2>' + ''.join(f'<h3>{E(q)}</h3><p>{E(a)}</p>' for q, a in items)
def links_html(title, items): return f'<h2>{E(title)}</h2><ul>' + ''.join(f'<li><a href="{h}">{E(t)}</a></li>' for t, h in items) + '</ul>'
SVC_LINKS = [(s['title'], f"/services/{s['slug']}/") for s in SERVICES]
IND_LINKS = [(i['title'], f"/industries/{i['slug']}/") for i in INDUSTRIES]
NAV_LINKS = '<nav><a href="/">Home</a> <a href="/#kyro-services">Services</a> <a href="/#kyro-industries">Industries</a> <a href="/results/">Results</a> <a href="/case-studies/">Case studies</a> <a href="/apply/">Apply</a> <a href="/privacy/">Privacy</a> <a href="/terms/">Terms</a></nav>'

def seo_home():
    cases = ''.join(f'<h3>{E(c["name"])}</h3><p>{E(c["stat"])} {E(c["label"])}. {E(c["body"])}</p>' for c in CASES[:3])
    return (NAV_LINKS + '<h1>Performance Advertising For Automotive Businesses</h1>'
            "<p>We run Meta, Google and TikTok ads for detailers, car washes, tinters and ceramic coating, PPF and headlight restoration businesses, so your phone rings with local car owners, not people who'll never book.</p>"
            + '<h2>Everything your automotive business needs to get booked</h2><ul>' + ''.join(f'<li><a href="/services/{s["slug"]}/">{E(s["title"])}</a>: {E(s["short"])}</li>' for s in SERVICES) + '</ul>'
            + '<h2>Built for automotive businesses</h2><ul>' + ''.join(f'<li><a href="/industries/{i["slug"]}/">{E(i["title"])}</a>: {E(i["short"])}</li>' for i in INDUSTRIES) + '</ul>'
            + '<h2>Real and steady progress</h2><p>From first-time detailing customers to high-ticket ceramic coating and PPF jobs, we build campaigns around the numbers that matter to a workshop: enquiries, bookings and return on ad spend. 13+ clients, 5× return on ads spend, $35K+ added revenue.</p>'
            + '<h2>A clear process, from day one</h2>' + ''.join(f'<h3>{E(t)}</h3><p>{E(b)}</p>' for t, b in PROCESS)
            + '<h2>Results for automotive businesses</h2>' + cases
            + '<h2>A team that treats your budget like our own</h2><p>Kyro Marketing is a small, Victoria-based team of media buyers and creative strategists. We focus on automotive businesses, from detailing and car washes to tinting, ceramic coating, PPF and headlight restoration, and we\'d rather run fewer accounts well than many accounts poorly.</p>'
            + faq_html(HOME_FAQ) + f'<p><a href="/apply/">Apply now</a> or email <a href="mailto:{SITE["email"]}">{SITE["email"]}</a>, call {SITE["phone_display"]}.</p>')

def seo_service(s):
    return (NAV_LINKS + f'<h1>{E(s["h1"])}</h1><p>{E(s["overview"])}</p><h2>What we do differently</h2>{ul(s["different"])}<h2>How this helps you</h2>{ul(s["benefits"])}<h2>Our process</h2>{ul(s["process"])}'
            + faq_html(s['faq']) + links_html(f'{s["title"]} for every automotive service', IND_LINKS) + links_html('Other services', [(o['title'], f"/services/{o['slug']}/") for o in SERVICES if o['slug'] != s['slug']]) + '<p><a href="/apply/">Apply now</a></p>')

def seo_industry(i):
    cs = [c for c in CASES if c['name'] in i['cases']]
    cases = ('<h2>Results in this industry</h2>' + ''.join(f'<h3>{E(c["name"])}</h3><p>{E(c["stat"])} {E(c["label"])}. {E(c["body"])}</p>' for c in cs)) if cs else ''
    return (NAV_LINKS + f'<h1>{E(i["h1"])}</h1><p>{E(i["intro"])}</p><h2>What works for {E(i["title"].lower())}</h2>{ul([t + ". " + b for t, b in i["angles"]])}<h2>Offers that work</h2>{ul(i["offers"])}<h2>Creative that gets attention</h2>{ul(i["creative"])}<h2>Your first month</h2>{ul(i["plan"])}{cases}'
            + faq_html(i['faq']) + links_html('The services we use', SVC_LINKS) + links_html('Other automotive industries', [(o['title'], f"/industries/{o['slug']}/") for o in INDUSTRIES if o['slug'] != i['slug']]) + '<p><a href="/apply/">Apply now</a></p>')

def seo_cases():
    return NAV_LINKS + '<h1>Case studies for automotive businesses</h1><p>Real campaigns for car washes, detailers, tinters and ceramic coating businesses around Australia. Results vary by business, area and budget.</p>' + ''.join(f'<h2>{E(c["name"])}</h2><p>{E(c["stat"])} {E(c["label"])}. {E(c["body"])}</p>' for c in CASES)

def seo_results():
    out = NAV_LINKS + '<h1>Real ad results from real campaigns</h1><p>Screenshots from Meta Ads Manager, with the numbers explained in plain English.</p>'
    for s in RESULTS:
        out += f'<h2>{E(s["h"])}</h2>' + ''.join(f'<p>{E(p)}</p>' for p in s['p'])
    return out

def seo_apply():
    return NAV_LINKS + "<h1>Apply to work with Kyro Marketing</h1><p>Tell us your name, phone number, what type of automotive business you run, your rough monthly ad budget and your biggest challenge. We'll be in touch soon.</p>" + f'<p>Email <a href="mailto:{SITE["email"]}">{SITE["email"]}</a> or call {SITE["phone_display"]}.</p>'

def seo_legal(kind):
    d = LEGAL[kind]
    body = ''.join(f'<h2>{E(sec["h"])}</h2>' + ''.join(f'<p>{E(p)}</p>' for p in sec.get('p', [])) + (ul(sec['ul']) if 'ul' in sec else '') for sec in d['sections'])
    return NAV_LINKS + f'<h1>{E(d["title"])}</h1><p>Last updated {d["updated"]}</p>' + body

# ------------------------------------------------------------------ pages
PAGES = []
def page(path, title, desc, seo, schema, og_title=None):
    PAGES.append(dict(path=path, title=title, desc=desc, seo=seo, schema=schema, og_title=og_title or title))

page('', 'Advertising for Automotive Businesses | Kyro Marketing',
     'Meta, Google and TikTok ads for car detailing, car wash, window tinting, ceramic coating, PPF and headlight restoration businesses. Kyro Marketing, Victoria, Australia.',
     seo_home(), [ORG, WEBSITE, faq_schema(HOME_FAQ)])
for s in SERVICES:
    page(f"services/{s['slug']}/", f"{s['title']} for automotive businesses | Kyro Marketing", s['meta'], seo_service(s),
         [{"@context": "https://schema.org", "@type": "Service", "name": s['title'] + ' for automotive businesses', "serviceType": s['title'], "description": s['overview'],
           "provider": {"@id": URL + "/#org"}, "areaServed": {"@type": "Country", "name": "Australia"}, "audience": {"@type": "BusinessAudience", "audienceType": "Automotive businesses"}, "url": f"{URL}/services/{s['slug']}/"},
          crumbs([('Home', '/'), ('Services', '/#kyro-services'), (s['title'], f"/services/{s['slug']}/")]), faq_schema(s['faq'])])
for i in INDUSTRIES:
    page(f"industries/{i['slug']}/", f"{i.get('title_tag', i['h1'])} | Kyro Marketing", i['meta'], seo_industry(i),
         [crumbs([('Home', '/'), ('Industries', '/#kyro-industries'), (i['title'], f"/industries/{i['slug']}/")]), faq_schema(i['faq']),
          {"@context": "https://schema.org", "@type": "Service", "name": f"Advertising for {i['title'].lower()} businesses", "serviceType": "Digital advertising", "description": i['intro'],
           "provider": {"@id": URL + "/#org"}, "areaServed": {"@type": "Country", "name": "Australia"}, "url": f"{URL}/industries/{i['slug']}/"}])
page('case-studies/', 'Case studies: results for automotive businesses | Kyro Marketing', 'Campaign results for car wash, car detailing, window tinting and ceramic coating businesses across Australia.', seo_cases(), [crumbs([('Home', '/'), ('Case studies', '/case-studies/')])])
page('results/', 'Real Meta ad results for automotive businesses | Kyro Marketing', 'Screenshots and plain-English explanations of real Meta ad campaigns for tinting, PPF and other automotive businesses, including costs per enquiry and click rates.', seo_results(), [crumbs([('Home', '/'), ('Ad results', '/results/')])])
page('apply/', 'Apply | Kyro Marketing', 'Apply to work with Kyro Marketing. Tell us about your automotive business and we will come back to you about the services that fit.', seo_apply(), [crumbs([('Home', '/'), ('Apply', '/apply/')])])
page('privacy/', 'Privacy policy | Kyro Marketing', 'How Kyro Marketing collects, uses and protects the information you share through this website, including the apply form and site analytics.', seo_legal('privacy'), [crumbs([('Home', '/'), ('Privacy policy', '/privacy/')])])
page('terms/', 'Terms | Kyro Marketing', 'The terms that apply to this Kyro Marketing website: how results are presented, how our services are agreed, and the third-party platforms we use.', seo_legal('terms'), [crumbs([('Home', '/'), ('Terms', '/terms/')])])

GA = (f"<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','{SITE['ga']}');"
      f"var done=0,f=function(){{if(done)return;done=1;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id={SITE['ga']}';document.head.appendChild(s)}};"
      "['scroll','pointerdown','keydown','touchstart'].forEach(function(e){addEventListener(e,f,{once:true,passive:true})});addEventListener('load',function(){setTimeout(f,5000)})</script>")

POSTER = '<img id="hero-poster" class="hero-bg-video" src="/assets/hero-poster.webp" srcset="/assets/hero-poster-m.webp 640w, /assets/hero-poster.webp 1280w" sizes="100vw" alt="" width="1280" height="720" fetchpriority="high" style="position:fixed;left:0;top:0;width:100%;height:100%;object-fit:cover;z-index:-1;pointer-events:none;filter:grayscale(1) sepia(1) hue-rotate(320deg) saturate(6) brightness(1.25) contrast(1.4) brightness(.3)">'

def shell(p):
    poster = POSTER if p['path'] == '' else ''
    preload = '<link rel="preload" as="image" href="/assets/hero-poster-m.webp" media="(max-width:767px)" fetchpriority="high">\n<link rel="preload" as="image" href="/assets/hero-poster.webp" media="(min-width:768px)" fetchpriority="high">\n' if p['path'] == '' else ''
    canon = URL + '/' + p['path']
    ld = ''.join(jsonld(x) for x in p['schema'])
    og = URL + '/assets/og-image.jpg'
    return f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(p['title'])}</title>
<meta name="description" content="{E(p['desc'])}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="{canon}">
<link rel="alternate" hreflang="en-AU" href="{canon}">
<link rel="alternate" hreflang="x-default" href="{canon}">
<meta name="theme-color" content="#0B0B0C">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kyro Marketing">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="{E(p['og_title'])}">
<meta property="og:description" content="{E(p['desc'])}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Kyro Marketing: performance advertising for automotive businesses">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{E(p['og_title'])}">
<meta name="twitter:description" content="{E(p['desc'])}">
<meta name="twitter:image" content="{og}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/instrument-serif-400-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/barlow-300.woff2" as="font" type="font/woff2" crossorigin>
{preload}<link rel="stylesheet" href="/css/site.css?v=@@css@@">
<style>#seo-content{{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}</style>
<noscript><style>#root{{display:none}}#seo-content{{position:static;width:auto;height:auto;clip:auto;white-space:normal;padding:96px 24px;max-width:860px;margin:0 auto;color:#F5F1EC;font:300 17px/1.6 Barlow,sans-serif}}#seo-content a{{color:#FF6B63}}#seo-content h1,#seo-content h2,#seo-content h3{{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;color:#fff}}#seo-content nav a{{margin-right:14px}}</style></noscript>
{ld}
{GA}
</head>
<body>
{poster}<main id="main"><div id="root"></div></main>
<div id="seo-content" aria-hidden="true" inert>{p['seo']}</div>
<script src="/js/data.js?v=@@data@@" defer></script>
<script src="/js/vendor/react.production.min.js" defer></script>
<script src="/js/vendor/react-dom.production.min.js" defer></script>
<script src="/js/vendor/framer-motion.js" defer></script>
<script src="/js/app.js?v=@@app@@" defer></script>
</body>
</html>
'''

import hashlib
def fhash(rel):
    try: return hashlib.sha1(open(os.path.join(ROOT, rel), 'rb').read()).hexdigest()[:8]
    except FileNotFoundError: return '0'

data_js = 'window.KYRO_DATA=' + json.dumps(data_for_js(), ensure_ascii=False, separators=(',', ':')) + ';'
write('js/data.js', data_js)
H_ = {'css': fhash('css/site.css'), 'app': fhash('js/app.js'), 'data': fhash('js/data.js')}
urls = []
for p in PAGES:
    html = shell(p)
    for k, v in H_.items(): html = html.replace(f'@@{k}@@', v)
    write((p['path'] + 'index.html') if p['path'] else 'index.html', html)
    urls.append('/' + p['path'])

def prio(u): return '1.0' if u == '/' else ('0.9' if u.count('/') == 3 else '0.6' if u in ('/privacy/', '/terms/') else '0.8')
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'] + [f'  <url><loc>{URL}{u}</loc><lastmod>{SITE["lastmod"]}</lastmod><priority>{prio(u)}</priority></url>' for u in urls] + ['</urlset>']
write('sitemap.xml', '\n'.join(sm) + '\n')
write('robots.txt', f'User-agent: *\nAllow: /\n\nSitemap: {URL}/sitemap.xml\n')
write('site.webmanifest', json.dumps({"name": "Kyro Marketing", "short_name": "Kyro", "start_url": "/", "display": "browser", "background_color": "#0B0B0C", "theme_color": "#0B0B0C",
      "icons": [{"src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png"}]}, indent=2))
write('404.html', '''<!DOCTYPE html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Kyro Marketing</title><meta name="robots" content="noindex, follow">
<link rel="icon" href="/favicon.ico"><style>@font-face{font-family:"Instrument Serif";font-style:italic;font-weight:400;font-display:swap;src:url(/fonts/instrument-serif-400-italic.woff2) format("woff2")}@font-face{font-family:Barlow;font-weight:300;font-display:swap;src:url(/fonts/barlow-300.woff2) format("woff2")}
body{margin:0;min-height:100vh;display:grid;place-items:center;text-align:center;background:#0B0B0C;color:#F5F1EC;font:300 17px/1.6 Barlow,sans-serif}h1{font:italic 400 clamp(44px,8vw,84px)/1 "Instrument Serif",serif;margin:0 0 16px;color:#fff}a{display:inline-block;margin:8px;padding:12px 22px;border-radius:999px;background:#fff;color:#000;text-decoration:none;font-weight:500}a+a{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4)}</style></head>
<body><main><h1>That page has gone missing.</h1><p>The page you're after may have moved. Try one of these.</p><a href="/">Back to home</a><a href="/#kyro-services">Our services</a><a href="/apply/">Apply now</a></main></body></html>
''')
write('_headers', '''/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://api.web3forms.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self'; media-src 'self'; manifest-src 'self'; form-action 'self' https://api.web3forms.com; base-uri 'self'; frame-ancestors 'self'; object-src 'none'

/assets/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/js/*
  Cache-Control: public, max-age=31536000, immutable
/css/*
  Cache-Control: public, max-age=31536000, immutable
/*.html
  Cache-Control: public, max-age=0, must-revalidate
''')
print(f'built {len(PAGES)} pages, data.js {len(data_js)} bytes')
