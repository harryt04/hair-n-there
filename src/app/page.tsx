import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  House,
  MapPin,
  Scissors,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FrequentlyAskedQuestions } from "@/components/site/faq";
import { InstagramLink } from "@/components/site/instagram-link";
import { JourneyRoads } from "@/components/scenic/journey-roads";
import { MountainLandscape } from "@/components/scenic/landscape";
import { RoadBand } from "@/components/scenic/road-band";
import { business } from "@/data/business";
import { availability } from "@/data/availability";
import { services } from "@/data/services";
import { familyPackages } from "@/data/packages";
import { formatMoney } from "@/lib/quote";
import styles from "@/components/scenic/scenic.module.css";

export const metadata: Metadata = {
  title: "Beautiful Hair, Wherever You Are.",
  description:
    "Meet HairnThere: a little mountain spirit and a personal approach to hair. Explore services, family plans, and consultation inquiries with Elisabeth in Suncrest, Draper, Utah.",
  alternates: { canonical: "/" },
};

const highlights = [
  {
    id: "womens-haircut-blow-dry",
    title: "A fresh feeling.",
    copy: "A haircut and blow-dry, with a little time set aside for you.",
    label: "Cuts & finishing",
  },
  {
    id: "root-touch-up",
    title: "Your kind of color.",
    copy: "A root refresh is one place to start. Highlights and balayage open up a whole new chapter.",
    label: "Color & dimension",
  },
  {
    id: "extension-consultation",
    title: "A little more you.",
    copy: "Talk through your ideas for length and fullness. Extension hair is priced separately.",
    label: "Extensions",
  },
];
const settings = [
  {
    id: "house",
    Icon: House,
    title: "A little closer to home.",
    href: "/contact?visit=house",
    action: "Ask about future house calls",
  },
  {
    id: "salon",
    Icon: Scissors,
    title: "A chair just for you.",
    href: "/contact?visit=salon",
    action: "Share your salon interest",
  },
  {
    id: "event",
    Icon: Sparkles,
    title: "A day to remember.",
    href: "/contact?visit=event",
    action: "Talk about your event",
  },
] as const;

export default function Home() {
  return (
    <main id="main-content">
      <JourneyRoads>
        <section className={styles.hero} aria-labelledby="hero-heading">
          <MountainLandscape />
          <div className={styles.heroContent}>
            <Image
              src="/brand/logo.png"
              width={600}
              height={600}
              sizes="168px"
              preload
              alt="HairnThere’s H monogram with mountains, gold scissors, and a little Subaru."
              className={styles.logo}
            />
            <p className="text-[10px] font-semibold tracking-[.22em] text-secondary uppercase">
              Great Hair Travels.
            </p>
            <h1 id="hero-heading" className={styles.headline}>
              Beautiful Hair,
              <br />
              <em>Wherever You Are.</em>
            </h1>
            <p className={styles.heroCopy}>
              A little alpine adventure. A little everyday luxury.
              <br className="hidden sm:block" /> Something beautiful, made
              personal.
            </p>
            <div className={styles.heroActions}>
              <Button
                render={<Link href="/contact" />}
                nativeButton={false}
                className="h-12 px-6 text-xs sm:h-13"
              >
                Meet your next look <ArrowUpRight aria-hidden="true" />
              </Button>
              <Button
                render={<Link href="/services" />}
                nativeButton={false}
                variant="outline"
                className="h-12 border-foreground/20 bg-background/60 px-6 text-xs backdrop-blur-sm hover:bg-background/85 sm:h-13"
              >
                Services & prices
              </Button>
            </div>
          </div>
        </section>

        <div className="border-b border-border py-5">
          <div className="site-container flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[9px] font-medium tracking-[.13em] text-secondary uppercase sm:gap-x-8 sm:text-[10px]">
            <span>Suncrest · Draper, Utah</span>
            <span aria-hidden="true">✦</span>
            <span>Highland · Alpine</span>
            <span aria-hidden="true">✦</span>
            <span>A new chapter is coming</span>
          </div>
        </div>

        <section
          id="work"
          className="site-container scroll-mt-8 pt-16 sm:pt-24"
          aria-labelledby="work-heading"
        >
          <div className="grid items-center gap-9 md:grid-cols-[1.03fr_.97fr] md:gap-14 lg:gap-22">
            <figure className="relative aspect-[5/6] overflow-hidden rounded-[16px] bg-muted sm:aspect-[5/5] md:aspect-[5/6]">
              <Image
                src="/images/inspiration-hair.webp"
                fill
                sizes="(max-width: 767px) 90vw, 46vw"
                alt="Stock hairstyle inspiration: soft, long waves. This is a mood image, not Elisabeth’s portfolio."
                className="object-cover object-center"
              />
              <figcaption className="absolute right-4 bottom-4 left-4">
                <span className="inline-block rounded-full bg-[#FBF7F2]/95 px-3 py-1.5 text-[8px] font-medium tracking-[.08em] text-[#3B2417] uppercase">
                  Style inspiration · stock image
                </span>
              </figcaption>
            </figure>
            <div>
              <p className={styles.chapter}>01 · Find your next feeling</p>
              <h2
                id="work-heading"
                className="mt-5 text-4xl leading-[1.12] tracking-[-.04em] sm:text-5xl lg:text-6xl"
              >
                Good hair.
                <br />
                <span className="text-secondary italic">
                  A little mountain magic.
                </span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-8 text-muted-foreground">
                A soft change, a bold new direction, or simply feeling more like
                yourself. Bring your ideas, explore the menu, and start a
                conversation with Elisabeth.
              </p>
              <p className="mt-4 max-w-md text-xs leading-7 text-muted-foreground">
                The inspiration here sets the mood. For Elisabeth’s previous
                work, visit{" "}
                <a
                  href={business.portfolioSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  @justbeyou_hair
                </a>
                . Follow the next chapter at @hairnthere.
              </p>
              <InstagramLink
                href={business.instagramUrl}
                className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-primary underline-offset-4 hover:underline"
              >
                <Camera className="size-4" aria-hidden="true" /> Explore
                Instagram <ArrowUpRight className="size-4" aria-hidden="true" />
              </InstagramLink>
            </div>
          </div>
        </section>

        <RoadBand chapter="A little mountain spirit. A lot of good hair." />

        <section
          id="services"
          className="site-container pb-16 sm:pb-24"
          aria-labelledby="services-heading"
        >
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className={styles.chapter}>02 · Made personal</p>
              <h2
                id="services-heading"
                className="mt-4 text-4xl tracking-[-.04em] sm:text-5xl"
              >
                A menu for your next chapter.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              Explore every service{" "}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => {
              const service = services.find((item) => item.id === highlight.id);
              return (
                <Card
                  key={highlight.id}
                  className="border border-border bg-card py-0 shadow-none ring-0"
                >
                  <CardContent className="flex h-full flex-col p-6 lg:p-8">
                    <span className="self-start rounded-full bg-muted px-3 py-1 text-[9px] text-secondary">
                      {highlight.label}
                    </span>
                    <h3 className="mt-7 text-[29px] tracking-[-.035em]">
                      {highlight.title}
                    </h3>
                    <p className="mt-4 mb-6 text-xs leading-7 text-muted-foreground">
                      {highlight.copy}
                    </p>
                    <div className="mt-auto border-t border-border pt-5">
                      <p className="text-[11px] text-muted-foreground">
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
          <p className="mt-5 max-w-3xl text-[11px] leading-6 text-muted-foreground">
            Prices marked + are starting prices. Color and extensions may need a
            custom quote; extension hair is separate. The menu is here to help
            you plan—appointments aren’t open yet.
          </p>
        </section>

        <section className="site-container" aria-labelledby="family-heading">
          <div className={styles.family}>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className={styles.chapter}>03 · Bring everyone along</p>
                <h2
                  id="family-heading"
                  className={`${styles.familyTitle} mt-5`}
                >
                  Your Whole Family.
                  <br />
                  One Appointment.
                  <br />
                  <span className="text-secondary italic">
                    Zero Salon Trips.
                  </span>
                </h2>
              </div>
              <div className="max-w-sm">
                <p className="text-xs leading-7 text-muted-foreground">
                  The family house-call experience we’re working toward. Explore
                  a package, plan for your people, and share your interest.
                </p>
                <p className="mt-3 text-xs font-medium leading-6 text-foreground">
                  Coming soon · House-call appointments are not open yet.
                </p>
                <Button
                  render={<Link href="/quote?visit=house" />}
                  nativeButton={false}
                  className="mt-5 h-12 px-6 text-xs"
                >
                  Find your family plan <ArrowUpRight aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {familyPackages.map((pack) => (
                <div
                  key={pack.id}
                  className="rounded-xl border border-border bg-background/70 p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl">{pack.name}</h3>
                    <span className="font-display text-2xl text-primary">
                      {formatMoney(pack.priceCents)}
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] leading-6 text-muted-foreground">
                    {pack.inclusions}
                  </p>
                  {pack.needsConfirmation && (
                    <p className="mt-2 text-[10px] leading-5 text-secondary">
                      Included women’s haircut type to be confirmed.
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-6 text-muted-foreground">
              Travel is separate and added once per household. Neighborhood
              haircut days are a custom arrangement—
              <Link
                href="/contact?topic=neighborhood"
                className="text-primary underline underline-offset-4"
              >
                ask about your neighborhood
              </Link>
              .
            </p>
          </div>
        </section>

        <RoadBand chapter="Good company. Beautiful possibilities." />

        <section
          id="about"
          className="site-container scroll-mt-8 pb-16 sm:pb-24"
          aria-labelledby="about-heading"
        >
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-16 lg:gap-24">
            <div>
              <p className={styles.chapter}>04 · Meet Elisabeth</p>
              <h2
                id="about-heading"
                className="mt-5 text-4xl leading-tight tracking-[-.04em] sm:text-5xl"
              >
                A personal touch.
                <br />
                <span className="text-secondary italic">A new chapter.</span>
              </h2>
            </div>
            <div className="space-y-5 text-sm leading-8 text-muted-foreground">
              <p>
                HairnThere is Elisabeth’s next chapter in hair: a playful
                mountain spirit, a thoughtful approach, and services shaped
                around the person in the chair.
              </p>
              <p>
                Based in Suncrest, a neighborhood in Draper, Utah. Future
                house-call plans include Draper, Highland, Alpine, and
                surrounding communities. A salon booth is another chapter still
                to come.
              </p>
              <p>
                For now, start with a question, a color idea, an extension
                consultation, or the family day you’re imagining. Service
                locations and availability will be confirmed before appointments
                open.
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
          className="border-y border-border bg-card/35"
          aria-labelledby="settings-heading"
        >
          <div className="site-container py-14 sm:py-20">
            <p className={styles.chapter}>
              Different plans. The same personal touch.
            </p>
            <h2
              id="settings-heading"
              className="mt-4 text-4xl tracking-[-.04em] sm:text-5xl"
            >
              Where could your next chapter begin?
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {settings.map(({ id, Icon, title, href, action }) => (
                <article
                  key={id}
                  className="flex flex-col rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon
                      className="size-5 text-secondary"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[9px] text-secondary">
                      {availability[id].status}
                    </span>
                  </div>
                  <p className="mt-6 text-[10px] font-semibold tracking-[.12em] text-secondary uppercase">
                    {availability[id].label}
                  </p>
                  <h3 className="mt-2 text-2xl">{title}</h3>
                  <p className="mt-4 mb-6 text-xs leading-7 text-muted-foreground">
                    {availability[id].message}
                  </p>
                  <Link
                    href={href}
                    className="mt-auto inline-flex items-center gap-2 text-xs font-semibold leading-6 text-primary underline-offset-4 hover:underline"
                  >
                    {action}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="site-container grid gap-8 py-16 sm:py-24 lg:grid-cols-[.75fr_1.25fr] lg:gap-20"
          aria-labelledby="faq-heading"
        >
          <div>
            <p className={styles.chapter}>Before the next chapter</p>
            <h2
              id="faq-heading"
              className="mt-4 text-4xl leading-tight tracking-[-.04em] sm:text-5xl"
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

        <section className="site-container pb-14 sm:pb-20">
          <div className="flex flex-col justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2 text-xs leading-6 text-muted-foreground">
              <MapPin
                className="size-4 shrink-0 text-secondary"
                aria-hidden="true"
              />
              Suncrest, Draper, Utah · Great Hair Travels.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              Let’s start with hello{" "}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </JourneyRoads>
    </main>
  );
}
