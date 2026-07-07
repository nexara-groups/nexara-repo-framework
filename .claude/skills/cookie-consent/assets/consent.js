/*
 * Cookie consent banner + preferences modal, wired to Google Consent Mode v2.
 * Vanilla JS, no dependencies. Requires:
 *   - the Consent Mode default snippet in <head> (see gtag-consent-mode.html)
 *   - consent.css for styling
 * Load before </body>:  <script src="/consent.js" defer></script>
 *
 * Customise the CONFIG block below (storage key, policy links, labels).
 */
(function () {
  'use strict';

  var CONFIG = {
    storeKey: 'cc-consent',              // keep in sync with the head snippet
    privacyUrl: '/privacy-policy.html',
    cookieUrl: '/cookie-policy.html',
    analyticsLabel: 'Analytics — Google Analytics'
  };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var KEY = CONFIG.storeKey;

    function read() {
      try { return JSON.parse(localStorage.getItem(KEY) || 'null'); }
      catch (e) { return null; }
    }

    // On reject/withdraw, delete existing GA cookies so the choice is effective now
    // (GDPR/DPDP: withdrawal must be as effective as consent).
    function clearGaCookies() {
      var host = location.hostname;
      var domains = ['', host, '.' + host];
      var parts = host.split('.');
      if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
      document.cookie.split(';').forEach(function (c) {
        var name = c.split('=')[0].trim();
        if (name.indexOf('_ga') === 0 || name === '_gid') {
          domains.forEach(function (d) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + (d ? ';domain=' + d : '');
          });
        }
      });
    }

    function save(analytics) {
      var rec = { necessary: true, analytics: !!analytics, ts: new Date().toISOString(), v: 1 };
      try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', { 'analytics_storage': analytics ? 'granted' : 'denied' });
      }
      if (!analytics) clearGaCookies();
    }

    var banner = document.createElement('div');
    banner.className = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cc-banner-inner">' +
        '<div class="cc-banner-text">' +
          '<strong>We value your privacy</strong>' +
          '<p>We use essential cookies to run this site and, with your consent, analytics to understand how it’s used. ' +
          'See our <a href="' + CONFIG.cookieUrl + '">Cookie Policy</a> and <a href="' + CONFIG.privacyUrl + '">Privacy Policy</a>.</p>' +
        '</div>' +
        '<div class="cc-banner-actions">' +
          '<button type="button" class="cc-btn cc-btn-ghost" data-cc="prefs">Preferences</button>' +
          '<button type="button" class="cc-btn cc-btn-ghost" data-cc="reject">Reject all</button>' +
          '<button type="button" class="cc-btn cc-btn-solid" data-cc="accept">Accept all</button>' +
        '</div>' +
      '</div>';

    var modal = document.createElement('div');
    modal.className = 'cc-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Cookie preferences');
    modal.innerHTML =
      '<div class="cc-modal-card">' +
        '<button type="button" class="cc-modal-close" data-cc="close" aria-label="Close">✕</button>' +
        '<h3>Cookie Preferences</h3>' +
        '<p class="cc-modal-lead">Choose which cookies we may use. Essential cookies are always on because the site can’t function without them. You can change this anytime.</p>' +
        '<div class="cc-row">' +
          '<div class="cc-row-text"><strong>Strictly necessary</strong><span>Remembers your cookie choice and keeps the site secure. Always active.</span></div>' +
          '<span class="cc-locked">Always on</span>' +
        '</div>' +
        '<div class="cc-row">' +
          '<div class="cc-row-text"><strong>' + CONFIG.analyticsLabel + '</strong><span>Helps us understand visits and improve the site. Sets <code>_ga</code> / <code>_ga_*</code> cookies.</span></div>' +
          '<label class="cc-switch"><input type="checkbox" id="cc-analytics"><span class="cc-slider"></span></label>' +
        '</div>' +
        '<div class="cc-modal-actions">' +
          '<button type="button" class="cc-btn cc-btn-ghost" data-cc="reject">Reject all</button>' +
          '<button type="button" class="cc-btn cc-btn-solid" data-cc="save">Save choices</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    var toggle = modal.querySelector('#cc-analytics');
    function hideBanner() { banner.classList.remove('show'); }
    function openModal() {
      var cur = read();
      toggle.checked = cur ? !!cur.analytics : false;
      modal.classList.add('open');
      setTimeout(function () { var c = modal.querySelector('.cc-modal-close'); if (c) c.focus(); }, 50);
    }
    function closeModal() { modal.classList.remove('open'); }
    function finalize(analytics) { save(analytics); hideBanner(); closeModal(); }

    banner.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cc]'); if (!a) return;
      var act = a.getAttribute('data-cc');
      if (act === 'accept') finalize(true);
      else if (act === 'reject') finalize(false);
      else if (act === 'prefs') openModal();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) { closeModal(); return; }
      var a = e.target.closest('[data-cc]'); if (!a) return;
      var act = a.getAttribute('data-cc');
      if (act === 'close') closeModal();
      else if (act === 'reject') finalize(false);
      else if (act === 'save') finalize(toggle.checked);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Reopen preferences anytime (footer link / consent withdrawal):
    //   <button type="button" onclick="openCookiePreferences()">Cookie Preferences</button>
    window.openCookiePreferences = openModal;

    // First visit (no stored choice) -> show the banner.
    if (!read()) banner.classList.add('show');
  });
})();
