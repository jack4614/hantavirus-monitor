import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hantavirus Updates",
  description: "Breaking news about the 2026 Hantavirus outbreak",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
