import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hantavirus Updates | Breaking News & Information",
  description: "Real-time monitoring of the 2026 Hantavirus outbreak. Breaking news, symptoms, prevention, and outbreak tracking across 7+ countries.",
  keywords: ["hantavirus", "outbreak", "2026", "breaking news", "health"],
  openGraph: {
    title: "Hantavirus Updates | Breaking News & Information",
    description: "Real-time monitoring of the 2026 Hantavirus outbreak",
    url: "https://www.hantavirus-updates.com",
    siteName: "Hantavirus Updates",
    images: [
      {
        url: "https://www.hantavirus-updates.com/opengraph-image?title=Hantavirus%20Updates&category=Breaking%20News",
        width: 1200,
        height: 630,
        alt: "Hantavirus Updates",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hantavirus Updates",
    description: "Real-time monitoring of the 2026 Hantavirus outbreak",
    images: ["https://www.hantavirus-updates.com/opengraph-image?title=Hantavirus%20Updates&category=Breaking%20News"],
  },
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
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
      </head>
      <body>{children}</body>
    </html>
  );
}
