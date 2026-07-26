import type { Metadata, Viewport } from "next";
import "../styles/index.css";

const SITE_URL = "https://www.yojosolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yojo Solutions | A learning path you can prove",
    template: "%s | Yojo Solutions",
  },
  description:
    "Student-first technology and cybersecurity learning with guidance, practical work, feedback and career support.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Yojo Solutions",
    title: "Yojo Solutions | A learning path you can prove",
    description:
      "Guidance, curriculum, practice, feedback and placement support, connected as one learning system.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Yojo Solutions | A learning path you can prove",
    description:
      "Guidance, curriculum, practice, feedback and placement support, connected as one learning system.",
  },
};

export const viewport: Viewport = {
  themeColor: "#06285e",
  colorScheme: "light",
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
    <html lang="en">
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
          type="application/ld+json"
          // Static, developer-authored object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
