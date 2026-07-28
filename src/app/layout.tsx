import type { Metadata, Viewport } from "next";
import "../styles/index.css";

const SITE_URL = "https://www.yojosolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yojo Solutions | Cybersecurity Training and IT Consulting",
    template: "%s | Yojo Solutions",
  },
  description:
    "Practical cybersecurity and technology training, career preparation, and IT consulting from Visakhapatnam.",
  openGraph: {
    type: "website",
    siteName: "Yojo Solutions",
    title: "Yojo Solutions | Cybersecurity Training and IT Consulting",
    description:
      "Practical cybersecurity and technology training, career preparation, and IT consulting.",
    url: SITE_URL,
    images: [
      {
        url: "/media/cyber/hero-signal.jpg",
        width: 1915,
        height: 821,
        alt: "Yojo cybersecurity learning and consulting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yojo Solutions | Cybersecurity Training and IT Consulting",
    description:
      "Practical cybersecurity and technology training, career preparation, and IT consulting.",
    images: ["/media/cyber/hero-signal.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#070a0d",
  colorScheme: "dark light",
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Yojo Solutions",
  url: SITE_URL,
  description:
    "Technology and cybersecurity learning, and IT consulting services for organisations.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Visakhapatnam",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is scoped to this <html> element only. It exists
    // because the inline `js-motion` script below mutates `document.documentElement.className`
    // before React hydrates, so the server-rendered class list never matches the
    // client's first paint. This intentionally silences a mismatch on THIS element's
    // attributes only (React does not recurse the suppression into children) -- it
    // does not cover, and must not be widened to cover, mismatches anywhere else in
    // the tree, including unrelated future attributes added to <html> by other means.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/media/fonts/onest-latin-variable.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/media/fonts/ibm-plex-mono-500.woff2"
          crossOrigin="anonymous"
        />
        <script
          // Applies the saved theme before paint and marks enhanced motion as available.
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=document.documentElement,t='dark';try{var s=localStorage.getItem('yojo-theme');if(s==='light'||s==='dark')t=s}catch(e){}r.dataset.theme=t;r.style.colorScheme=t;r.classList.add('js-motion');var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'#f4f8f9':'#070a0d')})()`,
          }}
        />
        <script
          type="application/ld+json"
          // Static, developer-authored object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
