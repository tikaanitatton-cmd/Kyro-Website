#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generates the static Kyro Marketing site into the folder above build/.
Run: python3 build/build.py"""
import json, os, html as H, sys
sys.path.insert(0, os.path.dirname(__file__))
from content import *
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
URL = SITE['url']
E = H.escape

ICONS = {
 'meta': '<path d="M3 12c0-3 1.7-6 4-6 3 0 5 6 5 6s2-6 5-6c2.3 0 4 3 4 6s-1.7 6-4 6c-3 0-5-6-5-6s-2 6-5 6c-2.3 0-4-3-4-6Z"/>',
 'web': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.8-3.8-9s1.3-6.4 3.8-9Z"/>',
 'search': '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
 'target': '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
 'creative': '<path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/>',
 'tiktok': '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.2 4.2 5 4.4"/>',
 'arrow': '<path d="M7 17 17 7M8 7h9v9"/>',
 'chev': '<path d="m6 9 6 6 6-6"/>',
 'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'chart': '<path d="M4 20V10M12 20V4M20 20v-7"/>',
 'insta': '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/>',
 'fb': '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z"/>',
}
def icon(name, cls=''):
    return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>'

SERVICE_BY = {s['slug']: s for s in SERVICES}
IND_BY = {i['slug']: i for i in INDUSTRIES}

class Page:
    def __init__(self, path, title, desc, body, depth=None, schema=None, noindex=False, og_title=None, preload_hero=False, extra_js=None, extra_head='', crumbs=None):
        self.path, self.title, self.desc, self.body = path, title, desc, body
        self.depth = depth if depth is not None else (len([p for p in path.split('/') if p]) if not path.endswith('.html') else 0)
        self.schema = schema or []; self.noindex = noindex; self.og_title = og_title or title
        self.preload_hero = preload_hero; self.extra_js = extra_js or []; self.extra_head = extra_head; self.crumbs = crumbs

def jsonld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '</script>'

def faq_schema(items):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}

def breadcrumb_schema(trail):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": URL + p} for i, (n, p) in enumerate(trail)]}

ORG = {"@context": "https://schema.org", "@type": "ProfessionalService", "@id": URL + "/#org", "name": SITE['name'], "url": URL + "/",
       "logo": URL + "/assets/icon-512.png", "image": URL + "/assets/og-image.jpg", "email": SITE['email'],
       "description": "Performance advertising for automotive businesses: Meta, Google and TikTok ads for car detailing, car wash, window tinting, ceramic coating, PPF and headlight restoration businesses.",
       "areaServed": {"@type": "Country", "name": "Australia"},
       "address": {"@type": "PostalAddress", "addressRegion": "VIC", "addressCountry": "AU"},
       "sameAs": [SITE['facebook'], SITE['instagram']],
       "contactPoint": {"@type": "ContactPoint", "contactType": "sales", "email": SITE['email'], "areaServed": "AU", "availableLanguage": "en"},
       "serviceType": "Digital advertising for automotive businesses",
       "knowsAbout": ["Meta ads", "Google Ads", "TikTok ads", "Car detailing marketing", "Window tinting marketing", "Ceramic coating marketing", "Paint protection film marketing"]}
WEBSITE = {"@context": "https://schema.org", "@type": "WebSite", "@id": URL + "/#website", "url": URL + "/", "name": SITE['name'], "publisher": {"@id": URL + "/#org"}, "inLanguage": "en-AU"}

def link_factory(depth):
    pre = '../' * depth
    def L(p=''):
        if p == '': return pre or './'
        return pre + p
    return L, pre

def header(L, current):
    items = [('Services', 'services/'), ('Industries', 'industries/'), ('Results', 'results/'), ('FAQ', '#faq')]
    out = []
    for name, p in items:
        href = (L('') + p) if p.startswith('#') else L(p)
        cur = ' aria-current="page"' if current == p else ''
        out.append(f'<a href="{href}"{cur}>{name}</a>')
    return f'''<a class="skip" href="#main">Skip to main content</a>
<header class="site-header">
<a class="brand" href="{L('')}" aria-label="Kyro Marketing home"><img src="{L('assets/logo-112.webp')}" width="56" height="56" alt=""><span>Kyro Marketing</span></a>
<button class="burger" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu"><i></i><i></i><i></i></button>
<nav class="nav glass" id="site-nav" aria-label="Main">{''.join(out)}<a class="btn btn--light" href="{L('apply/')}">Get More Clients {icon('arrow')}</a></nav>
</header>'''

def footer(L):
    svc = ''.join(f'<li><a href="{L("services/" + s["slug"] + "/")}">{s["title"]}</a></li>' for s in SERVICES)
    ind = ''.join(f'<li><a href="{L("industries/" + i["slug"] + "/")}">{i["title"]}</a></li>' for i in INDUSTRIES)
    return f'''<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div class="foot-brand"><a class="brand" href="{L('')}" aria-label="Kyro Marketing home"><img src="{L('assets/logo-112.webp')}" width="56" height="56" alt="" loading="lazy"><span>Kyro Marketing</span></a>
<p>Performance advertising for automotive businesses: detailing, car washes, tinting, ceramic coating, PPF and headlight restoration.</p>
<div class="social"><a class="glass" href="{SITE['facebook']}" target="_blank" rel="noopener" aria-label="Kyro Marketing on Facebook">{icon('fb')}</a><a class="glass" href="{SITE['instagram']}" target="_blank" rel="noopener" aria-label="Kyro Marketing on Instagram">{icon('insta')}</a></div></div>
<div><h2>Services</h2><ul>{svc}</ul></div>
<div><h2>Industries</h2><ul>{ind}</ul></div>
<div><h2>Company</h2><ul><li><a href="{L('case-studies/')}">Case studies</a></li><li><a href="{L('results/')}">Ad results</a></li><li><a href="{L('apply/')}">Apply now</a></li><li><a href="{L('privacy/')}">Privacy policy</a></li><li><a href="{L('terms/')}">Terms</a></li><li><a href="mailto:{SITE['email']}">{SITE['email']}</a></li></ul></div>
</div>
<div class="foot-bar"><span>&copy; 2026 Kyro Marketing. Victoria, Australia.</span><span>Results vary by business, area and budget.</span></div>
</div></footer>'''

def layout(p):
    L, pre = link_factory(p.depth)
    canon = URL + ('/' + p.path.strip('/') + '/' if p.path.strip('/') and not p.path.endswith('.html') else ('/' if not p.path.endswith('.html') else '/' + p.path))
    robots = 'noindex, follow' if p.noindex else 'index, follow, max-image-preview:large, max-snippet:-1'
    current = ''
    for key in ('services/', 'industries/', 'results/'):
        if p.path.startswith(key): current = key
    sprite = ''
    head_preload = f'''<link rel="preload" href="{pre}fonts/instrument-serif-400-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{pre}fonts/barlow-300.woff2" as="font" type="font/woff2" crossorigin>'''
    if p.preload_hero:
        head_preload += f'\n<link rel="preload" as="image" href="{pre}assets/hero-poster.webp" media="(min-width:701px)" fetchpriority="high">\n<link rel="preload" as="image" href="{pre}assets/hero-poster-m.webp" media="(max-width:700px)" fetchpriority="high">'
    og_img = URL + '/assets/og-image.jpg'
    ld = ''.join(jsonld(s) for s in p.schema)
    ga = f'''<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','{SITE['ga']}');var done=0,f=function(){{if(done)return;done=1;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id={SITE['ga']}';document.head.appendChild(s)}};['scroll','pointerdown','keydown','touchstart'].forEach(function(e){{addEventListener(e,f,{{once:true,passive:true}})}});addEventListener('load',function(){{setTimeout(f,5000)}})</script>'''
    scripts = f'<script src="{pre}js/site.js?v=@@site.js@@" defer></script>' + ''.join(f'<script src="{pre}js/{s}?v=@@{s}@@" defer></script>' for s in p.extra_js)
    return f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(p.title)}</title>
<meta name="description" content="{E(p.desc)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{canon}">
<link rel="alternate" hreflang="en-AU" href="{canon}">
<link rel="alternate" hreflang="x-default" href="{canon}">
<meta name="theme-color" content="#0B0B0C">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kyro Marketing">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="{E(p.og_title)}">
<meta property="og:description" content="{E(p.desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{og_img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Kyro Marketing: performance advertising for automotive businesses">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{E(p.og_title)}">
<meta name="twitter:description" content="{E(p.desc)}">
<meta name="twitter:image" content="{og_img}">
<link rel="icon" href="{pre}favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="{pre}assets/favicon-32.png">
<link rel="apple-touch-icon" href="{pre}assets/apple-touch-icon.png">
<link rel="manifest" href="{pre}site.webmanifest">
{head_preload}
<!--INLINE_CSS:{pre}-->
{p.extra_head}
{ld}
{ga if not p.noindex or p.path == 'thank-you' else ''}
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol></svg>
{header(L, current)}
<main id="main">
{p.body}
</main>
{footer(L)}
{scripts}
</body>
</html>
'''

# ----------------------------------------------------------------------------- building blocks
def crumbs_html(L, trail):
    items = [f'<li><a href="{L("")}">Home</a></li>']
    for i, (n, href) in enumerate(trail):
        if i == len(trail) - 1: items.append(f'<li aria-current="page">{E(n)}</li>')
        else: items.append(f'<li><a href="{href}">{E(n)}</a></li>')
    return f'<ol class="crumbs" aria-label="Breadcrumb">{"".join(items)}</ol>'

def cta_band(L, title="Ready to get more customers?", text="Tell us about your business. We'll come back with a plan for the services you most want to fill.", btn="Apply now"):
    return f'''<section class="section"><div class="wrap"><div class="cta glass reveal">
<h2>{E(title)}</h2><p class="lede">{E(text)}</p>
<div class="btn-row"><a class="btn btn--light" href="{L('apply/')}">{E(btn)} {icon('arrow')}</a><a class="btn btn--ghost" href="mailto:{SITE['email']}">Email us</a></div></div></div></section>'''

def faq_block(items, heading="Frequently asked questions", sid='faq', open_first=True):
    rows = []
    for i, (q, a) in enumerate(items):
        op = ' open' if (open_first and i == 0) else ''
        rows.append(f'<details{op}><summary>{E(q)}{icon("chev")}</summary><div class="ans"><p>{E(a)}</p></div></details>')
    return f'''<section class="section section--line" id="{sid}"><div class="wrap">
<span class="kicker">FAQ</span><h2 class="reveal" style="margin-bottom:36px">{E(heading)}</h2>
<div class="faq reveal">{''.join(rows)}</div></div></section>'''

def service_cards(L, items=None, lvl=3):
    out = []
    for i, s in enumerate(items or SERVICES):
        out.append(f'''<a class="svc card glass reveal" href="{L("services/" + s["slug"] + "/")}"><span class="num">{i+1:02d}</span>
<span class="svc__icon glass">{icon(s['icon'])}</span><small>{E(s['tag'])}</small><h{lvl}>{E(s['title'])}</h{lvl}><p>{E(s['short'])}</p>
<span class="link">Learn more {icon('arrow')}</span></a>''')
    return ''.join(out)

def case_cards(L, cases, link=True, lvl=3):
    out = []
    for c in cases:
        more = f'<a class="link" style="margin-top:14px" href="{L("industries/" + c["industry"] + "/")}">More on {E(IND_BY[c["industry"]]["title"].lower())} marketing {icon("arrow")}</a>' if link else ''
        out.append(f'''<article class="case card glass reveal"><span class="tag">{E(c['tag'])}</span><h{lvl}>{E(c['name'])}</h{lvl}>
<div class="num-big">{E(c['stat'])}</div><div class="label">{E(c['label'])}</div><p>{E(c['body'])}</p>{more}</article>''')
    return ''.join(out)

def page_hero(L, trail, kicker, h1, lede, ctas=True):
    btns = f'<div class="btn-row" style="margin-top:30px"><a class="btn btn--light" href="{L("apply/")}">Apply now {icon("arrow")}</a><a class="btn btn--ghost" href="{L("results/")}">See real results</a></div>' if ctas else ''
    return f'''<section class="page-hero"><div class="wrap">{crumbs_html(L, trail)}<span class="kicker">{E(kicker)}</span><h1>{E(h1)}</h1><p class="lede">{E(lede)}</p>{btns}</div></section>'''

pages = []

# ----------------------------------------------------------------------------- HOME
def home():
    L, _ = link_factory(0)
    chips = ''.join(f'<a class="chip glass" href="{L("industries/" + i["slug"] + "/")}">{E(i["title"])}</a>' for i in INDUSTRIES)
    steps = ''.join(f'<div class="step card glass reveal"><b>{n+1:02d}</b><h3>{E(t)}</h3><p>{E(b)}</p></div>' for n, (t, b) in enumerate(PROCESS))
    pillars = ''.join(f'<div class="card glass reveal"><h3>{E(t)}</h3><p style="margin:10px 0 0;color:var(--soft);font-size:16px">{E(b)}</p></div>' for t, b in ABOUT_PILLARS)
    st = SITE['stats']
    body = f'''<section class="hero" aria-labelledby="hero-title">
<picture><source media="(max-width:700px)" srcset="assets/hero-poster-m.webp"><img class="hero__bg" src="assets/hero-poster.webp" width="1280" height="720" alt="" fetchpriority="high" decoding="async"></picture>
<video class="hero__video" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-src="assets/hero.mp4"></video>
<div class="hero__inner">
<h1 id="hero-title">Performance Advertising For Automotive Businesses</h1>
<p class="lede">We run Meta, Google and TikTok ads for detailers, car washes, tinters and ceramic coating, PPF and headlight restoration businesses, so your phone rings with local car owners, not people who'll never book.</p>
<div class="btn-row"><a class="btn btn--light" href="apply/">Apply Now {icon('arrow')}</a><a class="btn btn--ghost" href="results/">See real results</a></div>
<div class="hero__stats">
<div class="stat glass">{icon('clock')}<b>{st['roas']}</b><span>Return on Ads Spend</span></div>
<div class="stat glass">{icon('web')}<b>{st['revenue']}</b><span>Added Revenue</span></div>
</div></div></section>

<section class="section" aria-labelledby="who-title"><div class="wrap center">
<span class="kicker">Who we help</span><h2 id="who-title" class="reveal">Built for automotive businesses</h2>
<p class="lede reveal" style="margin-top:16px">If you detail, wash, tint, coat or protect cars, we know how to fill your calendar.</p>
<div class="chips reveal" style="margin-top:34px">{chips}</div></div></section>

<section class="section section--line" id="services" aria-labelledby="svc-title"><div class="glow"></div><div class="wrap">
<div class="sec-head"><div><span class="kicker">Reach real customers</span><h2 id="svc-title">Everything your automotive business needs to get booked</h2></div><p>Six services that work together: the ads, the audience, the creative and the page they land on.</p></div>
<div class="grid grid--3">{service_cards(L)}</div></div></section>

<section class="section section--line" id="results" aria-labelledby="res-title"><div class="wrap">
<span class="kicker">All you require</span><h2 id="res-title" class="reveal">Real and steady progress</h2>
<p class="lede reveal" style="margin:16px 0 40px">From first-time detailing customers to high-ticket ceramic coating and PPF jobs, we build campaigns around the numbers that matter to a workshop: enquiries, bookings and return on ad spend.</p>
<div class="grid grid--3">
<div class="stat-card card glass reveal">{icon('clock')}<div class="big" style="margin-top:22px">{st['clients']}</div><h3>Happy Clients</h3><p>Strong partnerships with businesses seeing real success</p></div>
<div class="stat-card card glass reveal">{icon('chart')}<div class="big" style="margin-top:22px">{st['roas']}</div><h3>Return on Ads Spend</h3></div>
<div class="stat-card card glass reveal">{icon('web')}<div class="big" style="margin-top:22px">{st['revenue']}</div><h3>Added Revenue</h3></div>
</div></div></section>

<section class="section section--line" id="process" aria-labelledby="proc-title"><div class="wrap">
<span class="kicker">How we work</span><h2 id="proc-title" class="reveal" style="margin-bottom:40px">A clear process, from day one</h2>
<div class="grid grid--4">{steps}</div></div></section>

<section class="section section--line" id="work" aria-labelledby="work-title"><div class="wrap">
<div class="sec-head"><div><span class="kicker">Our work</span><h2 id="work-title">Results for automotive businesses</h2></div><p>A snapshot of the outcomes we aim for with every client, across car care and tinting businesses around Australia.</p></div>
<div class="grid grid--3">{case_cards(L, CASES[:3])}</div>
<p style="margin-top:34px" class="reveal"><a class="link" href="case-studies/">See more case studies {icon('arrow')}</a> &nbsp;&nbsp; <a class="link" href="results/">See the real ad screenshots {icon('arrow')}</a></p></div></section>

<section class="section section--line" id="about" aria-labelledby="about-title"><div class="wrap">
<span class="kicker">Who we are</span><h2 id="about-title" class="reveal">A team that treats your budget like our own</h2>
<p class="lede reveal" style="margin:16px 0 40px">Kyro Marketing is a small, Victoria-based team of media buyers and creative strategists. We focus on automotive businesses, from detailing and car washes to tinting, ceramic coating, PPF and headlight restoration, and we'd rather run fewer accounts well than many accounts poorly.</p>
<div class="grid grid--3">{pillars}</div></div></section>

{faq_block(HOME_FAQ)}
{cta_band(L, "Ready to get more customers?", "Whether you run a detailing studio, a car wash, a tint shop or a ceramic coating and PPF business, we build the ads that put your work in front of local car owners and turn them into booked jobs.", "Get started today")}'''
    return Page('', 'Advertising for Automotive Businesses | Kyro Marketing',
                'Meta, Google and TikTok ads for car detailing, car wash, window tinting, ceramic coating, PPF and headlight restoration businesses. Kyro Marketing, Victoria, Australia.',
                body, depth=0, schema=[ORG, WEBSITE, faq_schema(HOME_FAQ)], preload_hero=True)
pages.append(home())

# ----------------------------------------------------------------------------- SERVICES index + pages
def services_index():
    L, _ = link_factory(1)
    body = f'''{page_hero(L, [('Services', '')], 'Services', 'Advertising services for automotive businesses', 'Six services that work together to bring local car owners to your workshop: Meta ads, Google ads, TikTok ads, targeting, creative and a website that converts.')}
<section class="section"><div class="wrap"><div class="grid grid--3">{service_cards(L, lvl=2)}</div></div></section>
{cta_band(L)}'''
    return Page('services/', 'Advertising services for automotive businesses | Kyro Marketing',
                'Meta ads, Google ads, TikTok ads, audience targeting, ad creative and website design for detailers, tinters, ceramic coating and PPF businesses.',
                body, schema=[breadcrumb_schema([('Home', '/'), ('Services', '/services/')])])
pages.append(services_index())

def service_page(s):
    L, _ = link_factory(2)
    diff = ''.join(f'<div class="card glass reveal"><p style="margin:0;color:#fff;font-size:18px">{E(x)}</p></div>' for x in s['different'])
    steps = ''.join(f'<div class="step card glass reveal"><b>{n+1:02d}</b><p>{E(x)}</p></div>' for n, x in enumerate(s['process']))
    ben = ''.join(f'<li>{E(x)}</li>' for x in s['benefits'])
    inds = ''.join(f'<a class="chip glass" href="{L("industries/" + i["slug"] + "/")}">{E(i["title"])}</a>' for i in INDUSTRIES)
    others = ''.join(f'<a class="chip glass" href="{L("services/" + o["slug"] + "/")}">{E(o["title"])}</a>' for o in SERVICES if o['slug'] != s['slug'])
    body = f'''{page_hero(L, [('Services', L('services/')), (s['title'], '')], s['tag'], s['h1'], s['overview'])}
<section class="section section--line"><div class="wrap"><h2 class="reveal" style="margin-bottom:32px">What we do differently</h2><div class="grid grid--3">{diff}</div></div></section>
<section class="section section--line"><div class="wrap"><h2 class="reveal" style="margin-bottom:32px">How it works</h2><div class="grid grid--4">{steps}</div></div></section>
<section class="section section--line"><div class="wrap"><div class="grid grid--2" style="align-items:start;gap:60px"><div><h2 class="reveal">What you get</h2></div><ul class="ticks reveal">{ben}</ul></div></div></section>
<section class="section section--line"><div class="wrap center"><h2 class="reveal">{E(s['title'])} for every automotive service</h2><div class="chips reveal" style="margin-top:30px">{inds}</div></div></section>
{faq_block(s['faq'], f"{s['title']} questions", 'faq', True)}
<section class="section section--line"><div class="wrap center"><h2 class="reveal" style="font-size:36px">Other services</h2><div class="chips reveal" style="margin-top:26px">{others}</div></div></section>
{cta_band(L, f"Ready for {s['title']} that brings bookings?")}'''
    svc_schema = {"@context": "https://schema.org", "@type": "Service", "name": s['title'] + ' for automotive businesses', "serviceType": s['title'],
                  "description": s['overview'], "provider": {"@id": URL + "/#org"}, "areaServed": {"@type": "Country", "name": "Australia"},
                  "audience": {"@type": "BusinessAudience", "audienceType": "Automotive businesses"}, "url": f"{URL}/services/{s['slug']}/"}
    return Page(f"services/{s['slug']}/", f"{s['title']} for automotive businesses | Kyro Marketing", s['meta'], body,
                schema=[svc_schema, breadcrumb_schema([('Home', '/'), ('Services', '/services/'), (s['title'], f"/services/{s['slug']}/")]), faq_schema(s['faq'])])
for s in SERVICES: pages.append(service_page(s))

# ----------------------------------------------------------------------------- INDUSTRIES index + pages
def industries_index():
    L, _ = link_factory(1)
    cards = ''.join(f'''<a class="svc card glass reveal" href="{L("industries/" + i["slug"] + "/")}"><h2>{E(i['title'])}</h2><p>{E(i['intro'])}</p><span class="link">{E(i['title'])} marketing {icon('arrow')}</span></a>''' for i in INDUSTRIES)
    body = f'''{page_hero(L, [('Industries', '')], 'Industries', 'Marketing for automotive businesses', 'Every automotive service sells differently. Pick yours to see how we advertise it.')}
<section class="section"><div class="wrap"><div class="grid grid--3">{cards}</div></div></section>
{cta_band(L)}'''
    return Page('industries/', 'Marketing for automotive businesses | Kyro Marketing',
                'Advertising for car detailing, car wash, window tinting, ceramic coating, paint protection film and headlight restoration businesses.',
                body, schema=[breadcrumb_schema([('Home', '/'), ('Industries', '/industries/')])])
pages.append(industries_index())

def industry_page(i):
    L, _ = link_factory(2)
    angles = ''.join(f'<div class="card glass reveal"><h3>{E(t)}</h3><p style="margin:10px 0 0;color:var(--soft);font-size:16px">{E(b)}</p></div>' for t, b in i['angles'])
    cases = [c for c in CASES if c['name'] in i['cases']]
    case_html = (f'<section class="section section--line"><div class="wrap"><h2 class="reveal" style="margin-bottom:32px">Results in this industry</h2><div class="grid grid--3">{case_cards(L, cases, link=False)}</div><p class="reveal" style="margin-top:28px"><a class="link" href="{L("case-studies/")}">See all case studies {icon("arrow")}</a></p></div></section>'
                 if cases else '')
    svcs = ''.join(f'<a class="chip glass" href="{L("services/" + s["slug"] + "/")}">{E(s["title"])}</a>' for s in SERVICES)
    others_ind = ''.join(f'<a class="chip glass" href="{L("industries/" + o["slug"] + "/")}">{E(o["title"])}</a>' for o in INDUSTRIES if o['slug'] != i['slug'])
    offers = ''.join(f'<li>{E(x)}</li>' for x in i['offers'])
    creative = ''.join(f'<li>{E(x)}</li>' for x in i['creative'])
    plan = ''.join(f'<div class="step card glass reveal"><b>{n+1:02d}</b><p>{E(x)}</p></div>' for n, x in enumerate(i['plan']))
    body = f'''{page_hero(L, [('Industries', L('industries/')), (i['crumb'], '')], 'Industries', i['h1'], i['intro'])}
<section class="section section--line"><div class="wrap"><h2 class="reveal" style="margin-bottom:32px">What works for {E(i['title'].lower())}</h2><div class="grid grid--2">{angles}</div></div></section>
<section class="section section--line"><div class="wrap"><div class="grid grid--2" style="gap:60px;align-items:start"><div><h2 class="reveal">Offers that work</h2><ul class="ticks reveal" style="margin-top:24px">{offers}</ul></div><div><h2 class="reveal">Creative that gets attention</h2><ul class="ticks reveal" style="margin-top:24px">{creative}</ul></div></div></div></section>
<section class="section section--line"><div class="wrap"><h2 class="reveal" style="margin-bottom:32px">Your first month</h2><div class="grid grid--3">{plan}</div></div></section>
{case_html}
<section class="section section--line"><div class="wrap center"><h2 class="reveal">The services we use</h2><p class="lede reveal" style="margin-top:14px">Every campaign is built from the same toolkit, matched to how your customers find you.</p><div class="chips reveal" style="margin-top:30px">{svcs}</div></div></section>
<section class="section section--line"><div class="wrap center"><h2 class="reveal" style="font-size:36px">Other automotive industries</h2><div class="chips reveal" style="margin-top:26px">{others_ind}</div></div></section>
{faq_block(i['faq'], f"{i['title']} advertising questions", 'faq', True)}
{cta_band(L, f"Ready to fill your {i['title'].lower()} calendar?")}'''
    schema = [breadcrumb_schema([('Home', '/'), ('Industries', '/industries/'), (i['crumb'], f"/industries/{i['slug']}/")]), faq_schema(i['faq']),
              {"@context": "https://schema.org", "@type": "Service", "name": f"Advertising for {i['title'].lower()} businesses", "serviceType": "Digital advertising",
               "description": i['intro'], "provider": {"@id": URL + "/#org"}, "areaServed": {"@type": "Country", "name": "Australia"}, "url": f"{URL}/industries/{i['slug']}/"}]
    return Page(f"industries/{i['slug']}/", f"{i.get('title_tag', i['h1'])} | Kyro Marketing", i['meta'], body, schema=schema)
for i in INDUSTRIES: pages.append(industry_page(i))

# ----------------------------------------------------------------------------- CASE STUDIES
def case_studies():
    L, _ = link_factory(1)
    body = f'''{page_hero(L, [('Case studies', '')], 'Our work', 'Case studies for automotive businesses', 'Real campaigns for car washes, detailers, tinters and ceramic coating businesses around Australia. Results vary by business, area and budget.')}
<section class="section"><div class="wrap"><div class="grid grid--3">{case_cards(L, CASES, lvl=2)}</div>
<p class="reveal" style="margin-top:36px"><a class="link" href="{L('results/')}">See the real ad screenshots behind these results {icon('arrow')}</a></p></div></section>
{cta_band(L)}'''
    return Page('case-studies/', 'Case studies: results for automotive businesses | Kyro Marketing',
                'Campaign results for car wash, car detailing, window tinting and ceramic coating businesses across Australia.',
                body, schema=[breadcrumb_schema([('Home', '/'), ('Case studies', '/case-studies/')])])
pages.append(case_studies())

# ----------------------------------------------------------------------------- AD RESULTS
def results():
    L, _ = link_factory(1)
    slides = json.load(open(os.path.join(os.path.dirname(__file__), 'ad_results.json'), encoding='utf-8'))
    rows = []
    for n, s in enumerate(slides):
        img = f"assets/ad-result-{s['img']:02d}.webp"
        w, h = Image.open(os.path.join(ROOT, img)).size
        when = s['date'] or s['when']
        pill = {'good': 'pill--good', 'warn': 'pill--warn'}.get(s['tone'], '')
        paras = ''.join(f'<p>{E(x)}</p>' for x in s['p'])
        stats = ''.join(f'<div><b>{E(a)}</b>{b}</div>' for a, b in s['s'])
        alt = f"Meta Ads Manager screenshot: {s['h']}"
        eager = 'eager' if n == 0 else 'lazy'
        rows.append(f'''<article class="ad-result reveal"><figure><img src="{L(img)}" width="{w}" height="{h}" alt="{E(alt)}" loading="{eager}" decoding="async"></figure>
<div><div class="meta">{E(when)} &nbsp; <span class="pill {pill}">{E(s['tag'])}</span></div><h2>{E(s['h'])}</h2>{paras}<div class="ad-stats">{stats}</div></div></article>''')
    body = f'''{page_hero(L, [('Ad results', '')], 'Real results', 'Real ad results from real campaigns', "Screenshots from Meta Ads Manager, with the numbers explained in plain English. Some are strong, some are tests, and we show both. Results vary by business, area and budget.", ctas=False)}
<section class="section" style="padding-top:20px"><div class="wrap">{''.join(rows)}</div></section>
{cta_band(L, "Want results like these for your business?")}'''
    return Page('results/', 'Real Meta ad results for automotive businesses | Kyro Marketing',
                'Screenshots and plain-English explanations of real Meta ad campaigns for tinting, PPF and other automotive businesses, including costs per enquiry and click rates.',
                body, schema=[breadcrumb_schema([('Home', '/'), ('Ad results', '/results/')])])
pages.append(results())

# ----------------------------------------------------------------------------- APPLY / THANK YOU
def apply():
    L, _ = link_factory(1)
    body = f'''<section class="page-hero"><div class="wrap">{crumbs_html(L, [('Apply', '')])}<span class="kicker">Apply</span><h1>Let's find out if we're a fit</h1>
<p class="lede">Tell us about your business. We'll review it and come back to you about the services that will fill your calendar. It takes about a minute.</p></div></section>
<section class="section" style="padding-top:10px"><div class="wrap">
<form id="apply-form" class="form" action="https://api.web3forms.com/submit" method="POST" novalidate data-email="{SITE['email']}" data-thanks="{L('thank-you/')}">
<input type="hidden" name="access_key" value="{SITE['web3forms_key']}">
<input type="hidden" name="subject" value="New enquiry from kyromarketing.net">
<input type="hidden" name="from_name" value="Kyro Marketing: Apply form">
<input type="hidden" name="redirect" value="{URL}/thank-you/">
<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<div class="field"><label for="f-name">Your name</label><input class="input" id="f-name" name="Name" type="text" autocomplete="name" required></div>
<div class="field"><label for="f-phone">Best phone number</label><input class="input" id="f-phone" name="Phone" type="tel" inputmode="tel" autocomplete="tel" required></div>
<div class="field"><label for="f-email">Email <small>optional</small></label><input class="input" id="f-email" name="Email" type="email" autocomplete="email"></div>
<div class="field"><label for="f-biz">What type of automotive business do you run?</label><input class="input" id="f-biz" name="Business type" type="text" placeholder="e.g. Detailing, tinting, ceramic coating, PPF, headlight restoration" required></div>
<div class="field"><label for="f-loc">Suburb or city <small>optional</small></label><input class="input" id="f-loc" name="Location" type="text" autocomplete="address-level2"></div>
<div class="field"><label for="f-budget">Rough monthly ad budget</label><select class="input" id="f-budget" name="Monthly ad budget" required><option value="">Choose one</option><option>Under $500</option><option>$500 to $1,000</option><option>$1,000 to $3,000</option><option>$3,000 or more</option><option>Not sure yet</option></select></div>
<div class="field"><label for="f-msg">What's your biggest challenge right now? <small>optional</small></label><textarea class="input" id="f-msg" name="Biggest challenge"></textarea></div>
<div class="status" id="form-status" role="status" aria-live="polite" tabindex="-1"></div>
<div><button class="btn btn--light" type="submit">Send application</button></div>
<p class="form-note">We use these details only to reply to your application. See our <a class="link" href="{L('privacy/')}">privacy policy</a>.</p>
</form></div></section>'''
    return Page('apply/', 'Apply | Kyro Marketing', 'Apply to work with Kyro Marketing. Tell us about your automotive business and we will come back to you about the services that fit.',
                body, schema=[breadcrumb_schema([('Home', '/'), ('Apply', '/apply/')])], extra_js=['apply.js'])
pages.append(apply())

def thanks():
    L, _ = link_factory(1)
    body = f'''<section class="page-hero" style="min-height:70vh"><div class="wrap center"><span class="kicker">Thank you</span><h1>We'll be in touch soon.</h1>
<p class="lede">Your application is in. In the meantime, have a look at some real results.</p>
<div class="btn-row" style="justify-content:center;margin-top:30px"><a class="btn btn--light" href="{L('results/')}">See real results {icon('arrow')}</a><a class="btn btn--ghost" href="{L('')}">Back to home</a></div></div></section>
<script>if(window.gtag){{gtag('event','generate_lead',{{event_category:'apply_form'}});}}</script>'''
    return Page('thank-you/', 'Thank you | Kyro Marketing', 'Thanks for applying to Kyro Marketing.', body, noindex=True)
pages.append(thanks())

# ----------------------------------------------------------------------------- LEGAL (drafts)
def legal(path, title, desc, heading, sections):
    L, _ = link_factory(1)
    secs = ''.join(f'<h2>{E(t)}</h2>{x}' for t, x in sections)
    body = f'''<section class="page-hero"><div class="wrap">{crumbs_html(L, [(heading, '')])}<h1>{E(heading)}</h1><p class="lede">Last updated 20 November 2026.</p></div></section>
<section class="section" style="padding-top:10px"><div class="wrap prose">{secs}</div></section>'''
    return Page(path, title, desc, body, schema=[breadcrumb_schema([('Home', '/'), (heading, '/' + path)])])

pages.append(legal('privacy/', 'Privacy policy | Kyro Marketing', 'How Kyro Marketing collects, uses and protects the information you share through this website, including the apply form and site analytics.', 'Privacy policy', [
 ("What we collect", f"<p>When you apply through our form we collect the details you give us: your name, phone number, email address if you provide one, the type of business you run, your suburb or city, your ad budget range and any message. We also collect basic website analytics.</p>"),
 ("How we use it", "<ul><li>To reply to your application and discuss our services.</li><li>To understand how visitors use the site, so we can improve it.</li></ul><p>We do not sell your personal information.</p>"),
 ("Who handles it", "<p>Form submissions are sent to us through Web3Forms, a form processing service, and arrive by email. Site analytics are provided by Google Analytics, which uses cookies or similar technology to measure visits.</p>"),
 ("Your choices", f"<p>You can ask to see, correct or delete the information we hold about you at any time by emailing <a href=\"mailto:{SITE['email']}\">{SITE['email']}</a>. You can also block analytics cookies in your browser settings.</p>"),
 ("Contact", f"<p>Questions about this policy: <a href=\"mailto:{SITE['email']}\">{SITE['email']}</a>.</p>"),
]))
pages.append(legal('terms/', 'Terms | Kyro Marketing', 'The terms that apply to this Kyro Marketing website: how results are presented, how our services are agreed, and the third-party platforms we use.', 'Terms', [
 ("About this site", "<p>This website describes the advertising services offered by Kyro Marketing. Nothing on it is a binding offer. Services are provided under a separate written agreement.</p>"),
 ("Results", "<p>The case studies and ad screenshots on this site are examples of real campaigns. Results vary by business, location, budget, offer and market conditions, and we cannot guarantee particular results.</p>"),
 ("Month-to-month", "<p>Our engagements are month-to-month unless we agree otherwise in writing.</p>"),
 ("Third-party platforms", "<p>Our work runs on platforms such as Meta, Google and TikTok. Their policies, pricing and availability can change and are outside our control.</p>"),
 ("Contact", f"<p>Questions about these terms: <a href=\"mailto:{SITE['email']}\">{SITE['email']}</a>.</p>"),
]))

# ----------------------------------------------------------------------------- 404
def notfound():
    L, _ = link_factory(0)
    body = f'''<section class="page-hero" style="min-height:80vh"><div class="wrap center"><span class="kicker">404</span><h1>That page has gone missing.</h1>
<p class="lede">The page you're after may have moved. Try one of these.</p>
<div class="btn-row" style="justify-content:center;margin-top:30px"><a class="btn btn--light" href="/">Back to home</a><a class="btn btn--ghost" href="/services/">Our services</a><a class="btn btn--ghost" href="/apply/">Apply now</a></div></div></section>'''
    p = Page('404.html', 'Page not found | Kyro Marketing', 'Page not found.', body, depth=0, noindex=True)
    return p
nf = notfound()


# ----------------------------------------------------------------------------- minify + asset versioning
import re, hashlib
SRC = os.path.join(ROOT, 'src')

def css_min(css):
    keep = []
    def stash(m):
        keep.append(m.group(0)); return f'\u0000{len(keep)-1}\u0000'
    css = re.sub(r'url\((?:"[^"]*"|\'[^\']*\'|[^)]*)\)', stash, css)
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};,>])\s*', r'\1', css)
    css = re.sub(r':\s+', ':', css)
    css = css.replace(';}', '}')
    css = re.sub(r'\u0000(\d+)\u0000', lambda m: keep[int(m.group(1))], css)
    return css.strip()

def js_min(js):
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.S)
    out = []
    for line in js.split('\n'):
        t = line.strip()
        if not t or t.startswith('//'): continue
        out.append(t)
    return '\n'.join(out)

BLOCK = r'(?:html|head|body|meta|link|title|script|style|header|footer|nav|main|section|article|figure|div|ul|ol|li|form|details|summary|h[1-6]|p|label|select|option|textarea|symbol|picture|source|video|dl|dt|dd|br|hr)'
def html_min(h):
    parts = re.split(r'(<script\b.*?</script>|<style\b.*?</style>|<textarea\b.*?</textarea>)', h, flags=re.S)
    for i in range(0, len(parts), 2):
        t = re.sub(r'\s+', ' ', parts[i])
        t = re.sub(r'(</?' + BLOCK + r'\b[^>]*>) (?=<)', r'\1', t)
        t = re.sub(r'(?<=>) (?=</?' + BLOCK + r'\b)', '', t)
        parts[i] = t
    return ''.join(parts).strip() + '\n'

CSS_SRC = css_min(open(os.path.join(SRC, 'site.css'), encoding='utf-8').read())
JS_MIN = {}
for name in ('site.js', 'apply.js'):
    JS_MIN[name] = js_min(open(os.path.join(SRC, name), encoding='utf-8').read())
JS_HASH = {k: hashlib.sha1(v.encode()).hexdigest()[:8] for k, v in JS_MIN.items()}

def finish(html):
    html = re.sub(r'<!--INLINE_CSS:(.*?)-->', lambda m: '<style>' + CSS_SRC.replace('../fonts/', m.group(1) + 'fonts/') + '</style>', html)
    for k, v in JS_HASH.items():
        html = html.replace(f'@@{k}@@', v)
    return html_min(html)

# ----------------------------------------------------------------------------- write
def write(rel, text):
    full = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf-8').write(text)

urls = []
for p in pages:
    rel = os.path.join(p.path, 'index.html') if p.path else 'index.html'
    write(rel, finish(layout(p)))
    if not p.noindex: urls.append('/' + p.path if p.path else '/')
# the 404 page needs root-relative assets because it can be served from any path
html404 = layout(nf).replace('<!--INLINE_CSS:-->', '<!--INLINE_CSS:/-->').replace('href="./"', 'href="/"')
for attr in ('href', 'src'):
    for folder in ('css/', 'js/', 'assets/', 'fonts/'):
        html404 = html404.replace(f'{attr}="{folder}', f'{attr}="/{folder}')
html404 = html404.replace('href="favicon.ico"', 'href="/favicon.ico"').replace('href="site.webmanifest"', 'href="/site.webmanifest"')
write('404.html', finish(html404))
for name, code in JS_MIN.items():
    write('js/' + name, code)

def prio(u):
    return '1.0' if u == '/' else ('0.8' if u.count('/') <= 2 else '0.7')
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in urls:
    sm.append(f'  <url><loc>{URL}{u}</loc><lastmod>{SITE["lastmod"]}</lastmod><priority>{prio(u)}</priority></url>')
sm.append('</urlset>')
write('sitemap.xml', '\n'.join(sm) + '\n')
write('robots.txt', f'User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: {URL}/sitemap.xml\n')
write('site.webmanifest', json.dumps({"name": "Kyro Marketing", "short_name": "Kyro", "start_url": "/", "display": "browser", "background_color": "#0B0B0C", "theme_color": "#0B0B0C",
      "icons": [{"src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png"}]}, indent=2))
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
/favicon.ico
  Cache-Control: public, max-age=604800
/*.html
  Cache-Control: public, max-age=0, must-revalidate
''')
print(f'built {len(pages)} pages + 404, {len(urls)} in sitemap')
