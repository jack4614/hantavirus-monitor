import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hantavirus Monitor - Breaking News 2026",
  description: "Breaking news and updates on the 2026 Hantavirus outbreak",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        backgroundColor: '#f5f5f5',
      }}>
        {children}
      </body>
    </html>
  );
}