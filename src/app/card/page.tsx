import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/site/wordmark";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { CardActions } from "@/components/card/card-actions";
import { WebsiteQr } from "@/components/card/website-qr";
import { business } from "@/data/business";
import styles from "@/components/card/card.module.css";

export const metadata: Metadata = {
  title: "Digital business card",
  description:
    "Meet HairnThere. Scan the QR code to explore Elisabeth’s hair services in Suncrest, Draper, Utah and surrounding areas.",
  alternates: { canonical: "/card" },
};

export default function DigitalCardPage() {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.header}>
        <Wordmark />
        <ThemeToggle />
      </div>
      <div className={styles.intro}>
        <p className="eyebrow">Great Hair Travels.</p>
        <h1 className="mt-2 font-display text-3xl tracking-[-.035em] sm:text-4xl">
          Your next great hair day starts here.
        </h1>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Scan to explore cuts, color, extensions &amp; styling.
        </p>
      </div>
      <div className={styles.stage}>
        <WebsiteQr className={styles.qr} />
      </div>
      <div className={styles.footer}>
        <Link
          href={business.cardDestination}
          className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
        >
          {business.cardWebsiteLabel}{" "}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
        <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
          Suncrest · Draper, Utah &amp; surrounding areas
        </p>
        <CardActions />
        <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
          Let’s plan your hair day ·{" "}
          <Link href="/contact" className="underline underline-offset-4">
            Say hello
          </Link>
        </p>
      </div>
    </main>
  );
}
