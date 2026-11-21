#!/usr/bin/env python3
"""Builds one self-contained index.html (everything inlined) that works when double-clicked.
Page links become #hash links so it runs from disk. Usage: python3 tools/single_file.py out.html"""
import base64, os, re, sys, mimetypes
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
def rd(p, mode='r'): return open(os.path.join(ROOT, p), mode, **({} if 'b' in mode else {'encoding': 'utf-8'})).read()
def uri(p):
    mt = {'.mp4': 'video/mp4', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.jpg': 'image/jpeg'}[os.path.splitext(p)[1]]
    return f'data:{mt};base64,' + base64.b64encode(rd(p, 'rb')).decode()
css = rd('css/site.css')
css = re.sub(r'url\((/fonts/[^)]+)\)', lambda m: f'url({uri(m.group(1).lstrip("/"))})', css)
app = rd('js/app.js')
for name in sorted(os.listdir(os.path.join(ROOT, 'assets'))):
    if name.startswith(('ad-result-', 'hero.mp4', 'apply.mp4', 'wordmark')) and os.path.splitext(name)[1] in ('.mp4', '.webp', '.png'):
        app = app.replace('/assets/' + name, uri('assets/' + name))
data = rd('js/data.js')
libs = ''.join('<script>' + rd('js/vendor/' + n).replace('</script', '<\\/script') + '</script>' for n in ('react.production.min.js', 'react-dom.production.min.js', 'framer-motion.js'))
shim = r'''<script>window.__KYRO_FILE__=1;document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="/"]');if(!a)return;var h=a.getAttribute('href'),m,t=null;
if(h==='/'||h==='')t='#top';else if((m=h.match(/^\/#(.+)$/)))t='#'+m[1];else if((m=h.match(/^\/services\/([a-z0-9-]+)\/?$/)))t='#service-'+m[1];else if((m=h.match(/^\/industries\/([a-z0-9-]+)\/?$/)))t='#industry-'+m[1];
else if(h==='/apply/')t='#apply';else if(h==='/case-studies/')t='#case-studies';else if(h==='/results/')t='#ad-results';else if(h==='/privacy/')t='#privacy';else if(h==='/terms/')t='#terms';
if(t){e.preventDefault();if(location.hash===t){window.dispatchEvent(new HashChangeEvent('hashchange'))}else{location.hash=t}}});</script>'''
poster = '<img id="hero-poster" class="hero-bg-video" src="%s" alt="" style="position:fixed;left:0;top:0;width:100%%;height:100%%;object-fit:cover;z-index:-1;pointer-events:none;filter:grayscale(1) sepia(1) hue-rotate(320deg) saturate(6) brightness(1.25) contrast(1.4) brightness(.3)">' % uri('assets/hero-poster.webp')
head = ('<!DOCTYPE html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        '<title>Advertising for Automotive Businesses | Kyro Marketing</title>'
        '<meta name="description" content="Meta, Google and TikTok ads for car detailing, car wash, window tinting, ceramic coating, PPF and headlight restoration businesses. Kyro Marketing, Victoria, Australia.">'
        '<link rel="icon" href="%s"><meta name="theme-color" content="#0B0B0C"><style>' % uri('assets/favicon-32.png'))
out = head + css + '</style></head><body>' + poster + '<div id="root"></div><script>' + data.replace('</script', '<\\/script') + '</script>' + libs + shim + '<script>' + app.replace('</script', '<\\/script') + '</script></body></html>'
open(sys.argv[1], 'w', encoding='utf-8').write(out)
print(len(out) // 1024, 'KB')
