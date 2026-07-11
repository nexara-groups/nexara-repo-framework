import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ClinicSchema } from "@/components/clinic-schema";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["opsz"],
  style: ["normal", "italic"],
  weight: "variable",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://risemedicalhub.com"),
  title: { default: "Rise Medical Hub | Care, considered", template: "%s | Rise Medical Hub" },
  description: "Patient-first healthcare across EECP therapy, diagnostics, pharmacy, and OPD services in Madhurawada, Visakhapatnam.",
  openGraph: {
    siteName: "Rise Medical Hub",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable}`}>
      <body>
        <ClinicSchema />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
