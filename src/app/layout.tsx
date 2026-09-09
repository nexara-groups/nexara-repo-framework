import type { ReactNode } from "react";
import { generateMetadata } from "@shared/seo";

export const metadata = generateMetadata({
  title: "Nexara Foundation — Platform Architecture",
  description: "Provider-agnostic platform foundation built on Next.js 15, React 19, and Cloudflare Workers.",
  path: "",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
