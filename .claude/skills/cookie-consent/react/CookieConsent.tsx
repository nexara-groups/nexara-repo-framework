'use client';

/*
 * Cookie consent banner + preferences modal for React / Next.js (App Router).
 * Reuses the same `cc-*` CSS classes as the vanilla version — import
 * ../assets/consent.css (or copy it into your app) so this component is styled.
 *
 * Usage (e.g. in app/layout.tsx, inside <body>):
 *   import CookieConsent from '@/components/CookieConsent';
 *   <CookieConsent />
 *
 * Reopen preferences from anywhere (e.g. a footer link):
 *   import { openCookiePreferences } from '@/components/CookieConsent';
 *   <button onClick={openCookiePreferences}>Cookie Preferences</button>
 */

import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    openCookiePreferences?: () => void;
  }
}

const STORE_KEY = 'cc-consent';

interface ConsentRecord {
  necessary: true;
  analytics: boolean;
  ts: string;
  v: number;
}

function readConsent(): ConsentRecord | null {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  } catch {
    return null;
  }
}

/** Delete GA cookies so a reject/withdraw takes effect immediately. */
function clearGaCookies() {
  const host = location.hostname;
  const domains = ['', host, `.${host}`];
  const parts = host.split('.');
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join('.')}`);
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name.startsWith('_ga') || name === '_gid') {
      domains.forEach((d) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${d ? `;domain=${d}` : ''}`;
      });
    }
  });
}

/** Call from anywhere (footer link, etc.) to reopen the preferences modal. */
export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent('cc:open-preferences'));
}

export interface CookieConsentProps {
  privacyUrl?: string;
  cookieUrl?: string;
  analyticsLabel?: string;
}

export default function CookieConsent({
  privacyUrl = '/privacy-policy',
  cookieUrl = '/cookie-policy',
  analyticsLabel = 'Analytics — Google Analytics',
}: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const cur = readConsent();
    if (!cur) setShowBanner(true);
    setAnalytics(cur ? cur.analytics : false);

    const openPrefs = () => {
      const c = readConsent();
      setAnalytics(c ? c.analytics : false);
      setModalOpen(true);
    };
    window.addEventListener('cc:open-preferences', openPrefs);
    window.openCookiePreferences = openPrefs;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('cc:open-preferences', openPrefs);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const save = useCallback((allowAnalytics: boolean) => {
    const rec: ConsentRecord = {
      necessary: true,
      analytics: allowAnalytics,
      ts: new Date().toISOString(),
      v: 1,
    };
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(rec));
    } catch {
      /* storage unavailable */
    }
    window.gtag?.('consent', 'update', {
      analytics_storage: allowAnalytics ? 'granted' : 'denied',
    });
    if (!allowAnalytics) clearGaCookies();
    setShowBanner(false);
    setModalOpen(false);
  }, []);

  return (
    <>
      <div className={`cc-banner${showBanner ? ' show' : ''}`} role="dialog" aria-label="Cookie consent">
        <div className="cc-banner-inner">
          <div className="cc-banner-text">
            <strong>We value your privacy</strong>
            <p>
              We use essential cookies to run this site and, with your consent, analytics to
              understand how it’s used. See our <a href={cookieUrl}>Cookie Policy</a> and{' '}
              <a href={privacyUrl}>Privacy Policy</a>.
            </p>
          </div>
          <div className="cc-banner-actions">
            <button type="button" className="cc-btn cc-btn-ghost" onClick={() => setModalOpen(true)}>
              Preferences
            </button>
            <button type="button" className="cc-btn cc-btn-ghost" onClick={() => save(false)}>
              Reject all
            </button>
            <button type="button" className="cc-btn cc-btn-solid" onClick={() => save(true)}>
              Accept all
            </button>
          </div>
        </div>
      </div>

      <div
        className={`cc-modal${modalOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie preferences"
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalOpen(false);
        }}
      >
        <div className="cc-modal-card">
          <button type="button" className="cc-modal-close" aria-label="Close" onClick={() => setModalOpen(false)}>
            ✕
          </button>
          <h3>Cookie Preferences</h3>
          <p className="cc-modal-lead">
            Choose which cookies we may use. Essential cookies are always on because the site can’t
            function without them. You can change this anytime.
          </p>

          <div className="cc-row">
            <div className="cc-row-text">
              <strong>Strictly necessary</strong>
              <span>Remembers your cookie choice and keeps the site secure. Always active.</span>
            </div>
            <span className="cc-locked">Always on</span>
          </div>

          <div className="cc-row">
            <div className="cc-row-text">
              <strong>{analyticsLabel}</strong>
              <span>
                Helps us understand visits and improve the site. Sets <code>_ga</code> /{' '}
                <code>_ga_*</code> cookies.
              </span>
            </div>
            <label className="cc-switch">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              <span className="cc-slider" />
            </label>
          </div>

          <div className="cc-modal-actions">
            <button type="button" className="cc-btn cc-btn-ghost" onClick={() => save(false)}>
              Reject all
            </button>
            <button type="button" className="cc-btn cc-btn-solid" onClick={() => save(analytics)}>
              Save choices
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
