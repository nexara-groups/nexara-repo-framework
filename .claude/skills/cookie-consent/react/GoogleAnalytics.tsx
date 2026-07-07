/*
 * Google Analytics 4 with Consent Mode v2 for Next.js (App Router).
 * The consent 'default' (denied) runs BEFORE gtag config, so no analytics
 * cookies are set until <CookieConsent /> grants consent.
 *
 * Place in app/layout.tsx (inside <html>), passing your Measurement ID:
 *   import GoogleAnalytics from '@/components/GoogleAnalytics';
 *   <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
 *
 * Note: `beforeInteractive` scripts must live in the root layout.
 * Keep the storage key ('cc-consent') in sync with CookieConsent.tsx.
 */

import Script from 'next/script';

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  if (!gaId) return null;

  return (
    <>
      {/* 1) Consent Mode default = denied, and re-apply a saved choice. Runs first. */}
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent','default',{
            ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
            analytics_storage:'denied', functionality_storage:'granted',
            security_storage:'granted', wait_for_update:500
          });
          try {
            var c = JSON.parse(localStorage.getItem('cc-consent')||'null');
            if (c && c.analytics === true) gtag('consent','update',{analytics_storage:'granted'});
          } catch (e) {}
        `}
      </Script>

      {/* 2) Load GA (still cookieless until consent is granted). */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
