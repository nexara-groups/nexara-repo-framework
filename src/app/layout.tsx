import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Yojo Solutions | A learning path you can prove", template: "%s | Yojo Solutions" },
  description: "Student-first technology and cybersecurity learning with guidance, practical work, feedback and career support.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
