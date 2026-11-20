(function () {
'use strict';
var d = document, w = window, root = d.documentElement;
var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
var header = d.querySelector('.site-header');
function onScroll() { if (header) header.classList.toggle('is-solid', w.scrollY > 30 || d.body.classList.contains('nav-open')); }
onScroll(); w.addEventListener('scroll', onScroll, { passive: true });
var burger = d.querySelector('.burger');
if (burger) {
burger.addEventListener('click', function () {
var open = d.body.classList.toggle('nav-open');
burger.setAttribute('aria-expanded', open ? 'true' : 'false');
burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
onScroll();
});
d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.body.classList.contains('nav-open')) burger.click(); });
d.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { if (d.body.classList.contains('nav-open')) burger.click(); }); });
}
var items = [].slice.call(d.querySelectorAll('.reveal'));
if (reduce || !('IntersectionObserver' in w)) { items.forEach(function (n) { n.classList.add('is-in'); }); }
else {
var io = new IntersectionObserver(function (es) {
es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
items.forEach(function (n, i) { n.style.transitionDelay = ((i % 3) * 80) + 'ms'; io.observe(n); });
}
var v = d.querySelector('.hero__video');
if (v && !reduce) {
var conn = navigator.connection || {};
if (!conn.saveData && w.innerWidth > 700) {
var start = function () {
v.src = v.getAttribute('data-src');
v.addEventListener('playing', function () { v.classList.add('is-playing'); }, { once: true });
var p = v.play(); if (p && p.catch) p.catch(function () {});
};
if (d.readyState === 'complete') start(); else w.addEventListener('load', start, { once: true });
}
}
d.querySelectorAll('.faq').forEach(function (group) {
var all = [].slice.call(group.querySelectorAll('details'));
all.forEach(function (det) {
var sum = det.querySelector('summary'), ans = det.querySelector('.ans');
if (!sum || !ans) return;
var anim = null, closing = false;
function run(open) {
if (anim) anim.cancel();
if (reduce || !ans.animate) { det.open = open; closing = false; return; }
var from = open && !det.open ? 0 : ans.offsetHeight, to;
if (open) { det.open = true; to = ans.scrollHeight; } else { to = 0; }
closing = !open;
anim = ans.animate({ height: [from + 'px', to + 'px'], opacity: [open ? 0 : 1, open ? 1 : 0] },
{ duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
anim.onfinish = function () { if (!open) det.open = false; closing = false; anim = null; };
anim.oncancel = function () { anim = null; };
}
sum.addEventListener('click', function (e) {
e.preventDefault();
var shouldOpen = !det.open || closing;
if (shouldOpen) all.forEach(function (o) { if (o !== det && o.open) o.querySelector('summary').dispatchEvent(new CustomEvent('kyro-close')); });
run(shouldOpen);
});
sum.addEventListener('kyro-close', function () { run(false); });
});
});
})();