import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Camera, QrCode, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FrequentlyAskedQuestions } from "@/components/site/faq";
import { InstagramLink } from "@/components/site/instagram-link";
import { WebsiteQr } from "@/components/card/website-qr";
import { InstagramGallery } from "@/components/site/instagram-gallery";
import { business } from "@/data/business";
import { availability, launchNotice } from "@/data/availability";
import { services } from "@/data/services";
import { familyPackages } from "@/data/packages";
import { formatMoney } from "@/lib/quote";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "Beautiful Hair, Wherever You Are.",
  description:
    "Cuts, color, extensions and styling with Elisabeth. Explore HairnThere in Suncrest, Draper, Utah, browse services and start a consultation.",
  alternates: { canonical: "/" },
};

const highlights = [
  {
    id: "womens-haircut-blow-dry",
    label: "Cuts & styling",
    title: "A fresh start.",
    copy: "A thoughtful cut and a beautiful finish. Everyday hair that feels like you.",
  },
  {
    id: "root-touch-up",
    label: "Color & dimension",
    title: "Find your color.",
    copy: "From a root refresh to a new direction. Let’s talk through the possibilities.",
  },
  {
    id: "extension-consultation",
    label: "Extensions",
    title: "A little more you.",
    copy: "Explore length and fullness with a consultation. Extension hair is priced separately.",
  },
];

export default function Home() {
  return (
    <main id="main-content">
      <section
        className={`site-container ${styles.intro}`}
        aria-labelledby="hero-heading"
      >
        <div>
          <p className="eyebrow">HairnThere / Suncrest, Draper, Utah</p>
          <h1 id="hero-heading" className={styles.title}>
            Beautiful Hair,
            <br />
            <span className="text-primary italic">Wherever You Are.</span>
          </h1>
        </div>
        <div className={styles.stamp} aria-hidden="true">
          Great
          <br />
          Hair
          <br />
          Travels.
        </div>
        <p className={styles.launch}>{launchNotice}</p>
      </section>

      <InstagramGallery />
      <div className={`site-container ${styles.galleryAction}`}>
        <p>Cuts, color, extensions &amp; styling with Elisabeth.</p>
        <Button
          nativeButton={false}
          render={<Link href="/contact" />}
          className="h-11 gap-2 rounded-sm px-4 text-xs"
        >
          Let’s talk hair <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>

      <section
        id="services"
        className={`site-container ${styles.section}`}
        aria-labelledby="services-heading"
      >
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Your hair. Your kind of beautiful.</p>
            <h2
              id="services-heading"
              className="mt-4 font-display text-4xl tracking-[-.04em] sm:text-5xl"
            >
              Make room for a good hair day.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            View the full menu{" "}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.services}>
          {highlights.map((highlight) => {
            const service = services.find((item) => item.id === highlight.id);
            return (
              <Card
                key={highlight.id}
                className={`gap-0 py-0 shadow-none ring-0 ${styles.serviceCard}`}
              >
                <CardContent className="flex h-full flex-col px-0 py-6 md:px-6">
                  <p className="eyebrow">{highlight.label}</p>
                  <h3 className="mt-4 text-3xl tracking-[-.035em]">
                    {highlight.title}
                  </h3>
                  <p className="mt-4 mb-7 text-xs leading-7 text-muted-foreground">
                    {highlight.copy}
                  </p>
                  <div className="mt-auto">
                    <Separator />
                    <p className="mt-5 text-[11px] text-muted-foreground">
                      {service?.name}
                    </p>
                    <p className="mt-2 font-display text-2xl text-primary">
                      {service?.pricingKind === "free_consultation"
                        ? "Consultation · Free"
                        : service?.unitPriceCents != null
                          ? `${formatMoney(service.unitPriceCents)}${service.pricingKind === "from" ? "+" : ""}`
                          : "Let’s talk"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] leading-6 text-muted-foreground">
          Prices marked + are starting prices. The menu helps you plan;
          appointments aren’t open yet.
        </p>
      </section>

      <section
        className="site-container pb-14 sm:pb-20"
        aria-labelledby="family-heading"
      >
        <Card className={`gap-0 py-0 shadow-none ring-0 ${styles.familyCard}`}>
          <CardContent className="px-0 py-8 sm:py-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <Badge
                  variant="outline"
                  className="rounded-full bg-background text-[10px]"
                >
                  House calls · {availability.house.status}
                </Badge>
                <h2
                  id="family-heading"
                  className="mt-5 text-4xl leading-tight tracking-[-.04em] sm:text-5xl"
                >
                  Your whole family.
                  <br />
                  One future hair day.
                </h2>
              </div>
              <div className="max-w-sm">
                <p className="text-xs leading-7 text-muted-foreground">
                  The family house-call experience we’re working toward. Explore
                  a package and build a wish list. House-call appointments
                  aren’t open yet.
                </p>
                <Button
                  nativeButton={false}
                  render={<Link href="/quote?visit=house" />}
                  variant="outline"
                  className="mt-4 h-11 px-4 text-xs"
                >
                  Explore family plans <ArrowUpRight aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {familyPackages.map((pack) => (
                <div
                  key={pack.id}
                  className="border-t border-border py-5 md:border md:px-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl">{pack.name}</h3>
                    <p className="font-display text-2xl text-primary">
                      {formatMoney(pack.priceCents)}
                    </p>
                  </div>
                  <p className="mt-3 text-[11px] leading-6 text-muted-foreground">
                    {pack.inclusions}
                  </p>
                  {pack.needsConfirmation && (
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Included women’s haircut type to be confirmed.
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-6 text-muted-foreground">
              Travel is separate and added once per household. Neighborhood
              haircut days need a custom quote.
            </p>
          </CardContent>
        </Card>
      </section>

      <section
        id="about"
        className="site-container py-12 sm:py-20"
        aria-labelledby="about-heading"
      >
        <div className="grid gap-8 border-t border-border pt-12 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] md:gap-16">
          <div>
            <p className="eyebrow">Meet Elisabeth</p>
            <h2
              id="about-heading"
              className="mt-4 text-4xl leading-tight tracking-[-.04em] sm:text-5xl"
            >
              Personal hair.
              <br />
              <span className="text-primary italic">A familiar face.</span>
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-8 text-muted-foreground">
            <p>
              HairnThere is Elisabeth’s next chapter in hair: a playful mountain
              spirit, a thoughtful approach, and services shaped around the
              person in the chair. Mountain roots, a snowboard on the roof, and
              a personal approach to hair.
            </p>
            <p>
              Based in Suncrest, a neighborhood in Draper, Utah, with future
              plans for house calls around Draper, Highland, Alpine and
              surrounding communities. A salon booth is another chapter still to
              come.
            </p>
            <InstagramLink
              href={business.instagramUrl}
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
            >
              <Camera className="size-4" aria-hidden="true" /> Follow
              @hairnthere{" "}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </InstagramLink>
          </div>
        </div>
      </section>

      <section
        className="border-y border-border bg-card/30"
        aria-labelledby="availability-heading"
      >
        <div className="site-container py-12 sm:py-16">
          <p className="eyebrow">What’s next for HairnThere</p>
          <h2
            id="availability-heading"
            className="mt-4 text-3xl tracking-[-.035em] sm:text-4xl"
          >
            Good things are taking shape.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {(["house", "salon", "event"] as const).map((id) => (
              <div key={id} className="border-t border-border pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-sans text-sm font-semibold">
                    {availability[id].label}
                  </h3>
                  <Badge variant="outline" className="rounded-full text-[9px]">
                    {availability[id].status}
                  </Badge>
                </div>
                <p className="mt-4 text-xs leading-7 text-muted-foreground">
                  {availability[id].message}
                </p>
                <Link
                  href={`/contact?visit=${id}`}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
                >
                  Share your interest{" "}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="site-container grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] lg:gap-20"
        aria-labelledby="faq-heading"
      >
        <div>
          <p className="eyebrow">A few helpful details</p>
          <h2 id="faq-heading" className="mt-4 text-4xl tracking-[-.04em]">
            Before we say hello.
          </h2>
          <p className="mt-5 text-xs leading-7 text-muted-foreground">
            Something else on your mind?{" "}
            <Link
              href="/contact"
              className="text-primary underline underline-offset-4"
            >
              Just ask.
            </Link>
          </p>
        </div>
        <FrequentlyAskedQuestions />
      </section>

      <section className="site-container pb-14 sm:pb-20">
        <div className={styles.invitation}>
          <div>
            <p className="eyebrow">Suncrest · Draper, Utah</p>
            <h2 className="mt-3 text-3xl tracking-[-.035em]">
              Let’s talk about your next look.
            </h2>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/contact" />}
            className="h-12 self-start px-5 text-xs sm:self-auto"
          >
            <Scissors aria-hidden="true" /> Say hello to Elisabeth{" "}
            <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      </section>
      <section
        id="qr-code"
        className={`site-container ${styles.qr}`}
        aria-labelledby="qr-heading"
      >
        <div>
          <p className="eyebrow">Take a little HairnThere with you.</p>
          <h2 id="qr-heading">
            A quick hello.
            <br />
            <span className="text-primary italic">A lasting connection.</span>
          </h2>
          <p>
            Just met Elisabeth? Scan to explore.
            <br />
            Sharing with a neighbor? Show them the code.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/card" />}
            variant="outline"
            className="mt-6 h-11 gap-2 rounded-sm px-4 text-xs"
          >
            <QrCode aria-hidden="true" /> Open large QR code{" "}
            <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
        <Card className={`gap-0 py-0 shadow-none ring-0 ${styles.qrCard}`}>
          <CardContent className="p-5">
            <Link
              href="/card"
              className="block"
              aria-label="Open HairnThere’s large QR code"
            >
              <WebsiteQr className="aspect-square w-full bg-white" />
            </Link>
            <p className="mt-4 text-center text-sm font-semibold">
              {business.cardWebsiteLabel}
            </p>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Great Hair Travels.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
