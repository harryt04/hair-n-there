import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/site/providers";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Telemetry } from "@/components/site/telemetry";
import { business } from "@/data/business";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
    "Personal cuts, color, extensions, and styling with Elisabeth. Explore house calls around SunCrest and salon appointment inquiries. Great Hair Travels.",
  applicationName: business.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: business.name,
    title: "HairnThere · Great Hair Travels.",
    description:
      "A little mountain spirit. A lot of good hair. House calls and salon appointments with Elisabeth.",
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
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
      className={`${montserrat.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen">
        <Providers>
          <a
            href="#main-content"
            className="sr-only fixed top-3 left-3 z-100 rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only"
          >
            Skip to content
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
          <Telemetry />
        </Providers>
      </body>
    </html>
  );
}
