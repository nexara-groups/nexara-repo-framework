import type { Metadata } from "next";

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
}

/**
 * Standardized SEO metadata generator for Nexara modules.
 * Standardizes Title, Description, Canonical URL, Open Graph, and Twitter Cards.
 */
export function generateMetadata({
  title,
  description,
  path,
  ogImage,
  keywords,
}: GenerateMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexaragroups.com";
  // Clean up URL formatting
  const url = `${baseUrl}/${path}`.replace(/\/$/, "");
  const defaultImage = `${baseUrl}/brand/og-image.png`;

  return {
    title,
    description,
    keywords: keywords || [
      "Nexara",
      "Nexara Groups",
      "SaaS",
      "Enterprise Platform",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: "Nexara",
      title,
      description,
      url,
      images: [
        {
          url: ogImage || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage || defaultImage],
    },
  };
}
