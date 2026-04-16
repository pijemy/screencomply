import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { DemoBanner } from "@/components/demo-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ScreenComply — Florida Screen Contractor Compliance",
  description: "Compliance checklist wizard, license verification, permit tracking, and HOA approval workflows for Florida screen and pool enclosure contractors.",
  keywords: [
    "Florida contractor compliance",
    "screen enclosure license verification",
    "DBPR license check",
    "Florida permit requirements",
    "screen enclosure permits",
    "Orlando contractor compliance",
    "Orange County permits",
    "Seminole County permits",
    "Osceola County permits",
    "HOA approval workflow",
  ],
  openGraph: {
    title: "ScreenComply — Florida Screen Contractor Compliance",
    description: "Save 2-5 hours per project. Compliance checklists, license verification, permit tracking built for Florida screen enclosure contractors.",
    type: "website",
    locale: "en_US",
    siteName: "ScreenComply",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScreenComply — Stop wrestling with permits and compliance",
    description: "Built specifically for Florida screen enclosure contractors. License verification, permit lookup, compliance tracking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <DemoBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}