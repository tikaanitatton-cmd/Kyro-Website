/* Apply form: validates, posts to Web3Forms, then goes to the thank-you page.
   Without JavaScript the form still posts to Web3Forms and redirects there. */
(function () {
  'use strict';
  var form = document.getElementById('apply-form');
  if (!form) return;
  var status = document.getElementById('form-status'), btn = form.querySelector('button[type=submit]');
  var email = form.getAttribute('data-email'), thanks = form.getAttribute('data-thanks');
  function say(kind, html) { status.className = 'status is-on status--' + kind; status.innerHTML = html; status.focus(); }
  function mark(el, msg) {
    var f = el.closest('.field'), old = f.querySelector('.error');
    if (old) old.remove();
    el.removeAttribute('aria-invalid');
    if (!msg) return true;
    var p = document.createElement('p'); p.className = 'error'; p.id = el.id + '-err'; p.textContent = msg; f.appendChild(p);
    el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', p.id); return false;
  }
  function check(el) {
    var v = el.value.trim();
    if (el.required && !v) return mark(el, 'Please fill this in.');
    if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return mark(el, 'Enter a valid email address.');
    if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 8) return mark(el, 'Enter a valid phone number.');
    return mark(el, '');
  }
  [].slice.call(form.querySelectorAll('.input')).forEach(function (el) {
    el.addEventListener('blur', function () { if (el.value || el.getAttribute('aria-invalid')) check(el); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, first = null;
    [].slice.call(form.querySelectorAll('.input')).forEach(function (el) { if (!check(el)) { ok = false; if (!first) first = el; } });
    if (!ok) { say('err', 'Please fix the highlighted fields and try again.'); first.focus(); return; }
    var data = {}; new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
    if (data.botcheck) { location.href = thanks; return; }
    btn.disabled = true; btn.textContent = 'Sending…'; status.className = 'status';
    fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.success) throw new Error('failed'); }); })
      .then(function () {
        setTimeout(function () { location.href = thanks; }, 250);
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Send application';
        say('err', 'Something went wrong sending that. Please try again, or email us at <a href="mailto:' + email + '">' + email + '</a>.');
      });
  });
})();
