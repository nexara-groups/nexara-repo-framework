import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { default: "Rise Medical Hub | Care, considered", template: "%s | Rise Medical Hub" },
  description: "Patient-first healthcare across EECP therapy, diagnostics, pharmacy, and OPD services in Madhurawada, Visakhapatnam.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
