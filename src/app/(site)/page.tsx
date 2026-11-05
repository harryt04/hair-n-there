import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ContactSection } from "@/components/contact/contact-section";
import { FrequentlyAskedQuestions } from "@/components/site/faq";
import { InstagramLink } from "@/components/site/instagram-link";
import { InstagramGallery } from "@/components/site/instagram-gallery";
import { business } from "@/data/business";
import { availability, launchNotice } from "@/data/availability";
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
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Every head of hair is different. We’ll talk through your services and
          a personal quote before you commit.
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
                  One easier hair day.
                </h2>
              </div>
              <div className="max-w-sm">
                <p className="text-xs leading-7 text-muted-foreground">
                  Back-to-back haircuts, one familiar space. Tell us how many
                  people need a cut or color, and we’ll put together a plan for
                  your household.
                </p>
                <Button
                  nativeButton={false}
                  render={<Link href="#inquiry" />}
                  variant="outline"
                  className="mt-4 h-11 px-4 text-xs"
                >
                  Plan your family’s visit <ArrowUpRight aria-hidden="true" />
                </Button>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
              Group pricing and any travel cost are discussed individually. No
              automatic discounts or separate travel fee for each person.
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
              Based in Suncrest, a neighborhood in Draper, Utah, with house-call
              inquiries welcome around Draper, Highland, Alpine, and surrounding
              communities. We’ll confirm your location and availability
              together.
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
        className="site-container max-w-2xl pt-8"
        aria-label="A few helpful details"
      >
        <FrequentlyAskedQuestions />
      </section>
      <div className="site-container">
        <ContactSection />
      </div>
    </main>
  );
}
