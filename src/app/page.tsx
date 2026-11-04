import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  House,
  MapPin,
  Mountain,
  Scissors,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FrequentlyAskedQuestions } from "@/components/site/faq";
import { business } from "@/data/business";
import { InstagramLink } from "@/components/site/instagram-link";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const appointments = [
  {
    icon: House,
    title: "The house call",
    description:
      "A fresh look without the trip. Make room for one appointment, or bring the whole family together.",
    action: "Plan a house call",
    href: "/quote?visit=house",
  },
  {
    icon: Sparkles,
    title: "The salon visit",
    description:
      "A little time set aside for you. Tell Elisabeth what you have in mind and start a conversation.",
    action: "Find your salon moment",
    href: "/quote?visit=salon",
  },
  {
    icon: Scissors,
    title: "The new look",
    description:
      "Color, extensions, or a fresh direction. Start with an idea; we’ll work out the details together.",
    action: "Talk through your ideas",
    href: "/contact",
  },
];

export default function Home() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HairSalon",
            name: business.name,
            url: business.url,
            description: "Elisabeth’s house-call and salon hair services.",
            areaServed: { "@type": "Place", name: "SunCrest, Utah" },
            sameAs: [business.instagramUrl],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section
        className="site-container grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24"
        aria-labelledby="hero-heading"
      >
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-secondary uppercase">
            House calls · Salon appointments
          </p>
          <h1
            id="hero-heading"
            className="mt-6 font-display text-[clamp(3.2rem,6.7vw,6rem)] leading-[1.04] font-medium tracking-[-0.055em]"
          >
            Great hair.
            <br />
            <span className="text-secondary italic">
              A little closer
              <br />
              to home.
            </span>
          </h1>
          <p className="mt-7 max-w-md text-sm leading-8 text-muted-foreground sm:text-base">
            Cuts, color, extensions, and a little more you-time. HairnThere
            brings the salon feeling wherever life takes you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href="/quote?visit=house" />}
              nativeButton={false}
              className="h-12 rounded-lg px-5 text-xs sm:h-13 sm:px-6"
            >
              Book a house call <ArrowUpRight aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              render={<Link href="/quote?visit=salon" />}
              nativeButton={false}
              className="h-12 rounded-lg px-5 text-xs sm:h-13 sm:px-6"
            >
              Salon appointment
            </Button>
          </div>
          <p className="mt-7 flex items-center gap-2.5 text-[11px] text-muted-foreground">
            <span
              className="size-1.5 rounded-full bg-gold"
              aria-hidden="true"
            />
            {business.serviceArea}
          </p>
        </div>
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-t-[48%] rounded-b-xl bg-[#FBF7F2] px-1 pt-10 pb-3 sm:px-3 sm:pt-12">
            <Image
              src="/brand/hairnthere-original.png"
              width={600}
              height={400}
              alt="HairnThere’s illustrated mountains, winding road, and salon-ready car. Great Hair Travels."
              sizes="(max-width: 1024px) 90vw, 42vw"
              preload
              className="h-auto w-full mix-blend-multiply"
            />
          </div>
          <p className="mt-6 text-center text-[9px] leading-5 tracking-[0.14em] text-muted-foreground uppercase">
            A little mountain spirit. A lot of good hair.
          </p>
        </div>
      </section>

      <div
        className="border-y border-border/80 py-5"
        aria-label="Hair services"
      >
        <div className="site-container flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[9px] font-medium tracking-[0.14em] text-secondary uppercase sm:gap-x-9 sm:text-[10px]">
          <span>Personal color</span>
          <span aria-hidden="true">✦</span>
          <span>Fresh cuts</span>
          <span aria-hidden="true">✦</span>
          <span>Extensions</span>
          <span aria-hidden="true" className="hidden sm:inline">
            ✦
          </span>
          <span>Great Hair Travels</span>
        </div>
      </div>

      <section
        id="work"
        className="site-container scroll-mt-8 py-16 sm:py-22"
        aria-labelledby="work-heading"
      >
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
              A little inspiration
            </p>
            <h2
              id="work-heading"
              className="mt-3 font-display text-4xl leading-tight tracking-[-0.035em] sm:text-5xl"
            >
              Find your next feeling.
            </h2>
          </div>
          {business.instagramUrl ? (
            <InstagramLink
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-secondary underline-offset-4 hover:underline"
            >
              Explore Instagram{" "}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </InstagramLink>
          ) : (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-medium text-secondary underline-offset-4 hover:underline"
            >
              Share your inspiration{" "}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:aspect-[5/4]">
              <Image
                src="/images/inspiration-portrait.webp"
                fill
                sizes="(max-width: 768px) 45vw, 48vw"
                alt="Stock style inspiration: softly waved brunette hair."
                className="object-cover object-[center_35%] transition-transform duration-700 motion-safe:hover:scale-[1.03]"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-[#FBF7F2]/95 px-2.5 py-1 text-[8px] font-medium tracking-wide text-[#3B2417] uppercase sm:bottom-4 sm:left-4">
                Style inspiration
              </span>
            </div>
            <figcaption className="mt-3 text-[11px] leading-5 text-muted-foreground sm:text-xs">
              Soft texture. Effortless movement.
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:aspect-[5/4]">
              <Image
                src="/images/inspiration-hair.webp"
                fill
                sizes="(max-width: 768px) 45vw, 48vw"
                alt="Stock style inspiration: long, flowing hair with natural movement."
                className="object-cover object-center transition-transform duration-700 motion-safe:hover:scale-[1.03]"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-[#FBF7F2]/95 px-2.5 py-1 text-[8px] font-medium tracking-wide text-[#3B2417] uppercase sm:bottom-4 sm:left-4">
                Style inspiration
              </span>
            </div>
            <figcaption className="mt-3 text-[11px] leading-5 text-muted-foreground sm:text-xs">
              Personal details. A fresh perspective.
            </figcaption>
          </figure>
        </div>
        <p className="mt-4 text-[10px] leading-5 text-muted-foreground">
          Stock inspiration imagery, not Elisabeth’s portfolio.{" "}
          <a
            href={business.portfolioSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            See Elisabeth’s previous work at @justbeyou_hair ↗
          </a>
        </p>
      </section>

      <section
        id="services"
        className="site-container scroll-mt-8 pb-16 sm:pb-22"
        aria-labelledby="services-heading"
      >
        <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
          Made for your kind of day
        </p>
        <h2
          id="services-heading"
          className="mt-3 font-display text-4xl tracking-[-0.035em] sm:text-5xl"
        >
          Your chair. Your choice.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {appointments.map(
            ({ icon: Icon, title, description, action, href }) => (
              <Card
                key={title}
                className="rounded-xl border-border bg-card py-0 shadow-none"
              >
                <CardContent className="flex h-full flex-col p-6 sm:p-7">
                  <Icon
                    className="mb-8 size-6 text-secondary"
                    strokeWidth={1.3}
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-[27px] font-medium tracking-[-0.025em]">
                    {title}
                  </h3>
                  <p className="mt-4 mb-6 text-xs leading-7 text-muted-foreground">
                    {description}
                  </p>
                  <Link
                    href={href}
                    className="mt-auto inline-flex items-center gap-2 text-xs leading-6 font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {action}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </section>

      <section
        className="site-container pb-16 sm:pb-22"
        aria-labelledby="family-heading"
      >
        <div className="flex flex-col items-start justify-between gap-7 rounded-2xl bg-muted px-7 py-9 sm:px-10 sm:py-11 lg:flex-row lg:items-center">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
              A family haircut day?
            </p>
            <h2
              id="family-heading"
              className="mt-3 font-display text-3xl tracking-[-0.035em] sm:text-4xl"
            >
              Good hair, all together.
            </h2>
            <p className="mt-4 max-w-xl text-xs leading-7 text-muted-foreground sm:text-sm">
              Build a group request, then let’s find a time that works.
            </p>
          </div>
          <Button
            render={<Link href="/quote?visit=house" />}
            nativeButton={false}
            className="h-12 rounded-lg px-6 text-xs"
          >
            Plan your appointments <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      </section>

      <section
        id="about"
        className="border-y border-border/80 bg-card/35"
        aria-labelledby="about-heading"
      >
        <div className="site-container grid gap-8 py-14 sm:py-18 md:grid-cols-[0.8fr_1.2fr] md:gap-18">
          <div>
            <Mountain
              className="mb-5 size-8 text-secondary"
              strokeWidth={1.2}
              aria-hidden="true"
            />
            <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
              Meet Elisabeth
            </p>
            <h2
              id="about-heading"
              className="mt-3 font-display text-4xl leading-tight tracking-[-0.035em]"
            >
              A personal touch.
              <br />
              <span className="text-secondary italic">Wherever you are.</span>
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-8 text-muted-foreground">
            <p>
              HairnThere is Elisabeth’s invitation to make space for
              yourself—even on a full calendar. Whether that means a house call,
              a salon appointment, or talking through a new look, the starting
              point is the same: what works for you.
            </p>
            <p>
              Based around SunCrest, with house calls in surrounding communities
              by arrangement. Share your location and the services you have in
              mind so Elisabeth can confirm the details.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
            >
              Say hello to Elisabeth{" "}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="site-container grid gap-7 py-16 sm:py-22 lg:grid-cols-[0.8fr_1.2fr] lg:gap-18"
        aria-labelledby="faq-heading"
      >
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
            Before we meet
          </p>
          <h2
            id="faq-heading"
            className="mt-3 font-display text-4xl leading-tight tracking-[-0.035em]"
          >
            A few little
            <br />
            details.
          </h2>
          <p className="mt-5 max-w-xs text-xs leading-7 text-muted-foreground">
            Wondering about something else?{" "}
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

      <section className="site-container pb-16 sm:pb-22">
        <div className="flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-xs leading-6 text-muted-foreground">
            <MapPin
              className="size-4 shrink-0 text-secondary"
              aria-hidden="true"
            />
            SunCrest & surrounding communities · Travel confirmed before booking
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            Your next good hair day{" "}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
