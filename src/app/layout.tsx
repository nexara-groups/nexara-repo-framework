import type { ReactNode } from "react";

export const metadata = {
  title: "Nexara Foundation",
  description: "Provider-agnostic platform foundation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
