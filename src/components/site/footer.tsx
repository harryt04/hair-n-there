import Link from "next/link";
import { ArrowUpRight, Camera } from "lucide-react";
import { business } from "@/data/business";
import { InstagramLink } from "@/components/site/instagram-link";
import { Wordmark } from "@/components/site/wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="site-container flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Wordmark className="text-2xl" />
          <p className="mt-3 text-xs text-muted-foreground">
            Great Hair Travels. · Suncrest · Draper, Utah
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-6 gap-y-4 text-xs text-muted-foreground"
        >
          <Link
            href="/services"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Services & prices
          </Link>
          <Link
            href="/terms"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          {business.instagramUrl ? (
            <InstagramLink
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <Camera className="size-3.5" aria-hidden="true" /> Instagram{" "}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </InstagramLink>
          ) : (
            <Link href="/contact" className="hover:text-foreground">
              Say hello <span aria-hidden="true">↗</span>
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
