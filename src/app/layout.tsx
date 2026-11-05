import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { Providers } from "@/components/site/providers";
import { PwaSupport } from "@/components/site/pwa-support";
import { Telemetry } from "@/components/site/telemetry";
import { business } from "@/data/business";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});
const isPreview = process.env.VERCEL_ENV === "preview";
export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: "HairnThere | Great Hair Travels.",
    template: "%s | HairnThere",
  },
  description:
    "Good Hair. Good Vibes. Right in Your Neighborhood. Meet Elisabeth and explore cuts, color, extensions, and family hair days in Suncrest, Draper, Utah.",
  applicationName: business.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: business.name,
    title: "HairnThere · Great Hair Travels.",
    description:
      "Good Hair. Good Vibes. Right in Your Neighborhood. House-call appointments are coming soon, pending licensing approval. Inquiries are welcome!",
    images: [
      {
        url: "/brand/social-card.png",
        width: 1200,
        height: 630,
        alt: "HairnThere — Great Hair Travels.",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/brand/social-card.png"] },
  robots: isPreview
    ? { index: false, follow: false }
    : { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1323" },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen">
        <Providers>
          <a
            href="#main-content"
            className="sr-only fixed top-3 left-3 z-100 rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only"
          >
            Skip to content
          </a>
          {children}
          <PwaSupport />
          <Telemetry />
        </Providers>
      </body>
    </html>
  );
}
