import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ContactSection } from "@/components/contact/contact-section";
import { FrequentlyAskedQuestions } from "@/components/site/faq";
import { InstagramLink } from "@/components/site/instagram-link";
import { ServiceGuide } from "@/components/site/service-guide";
import { InstagramGallery } from "@/components/site/instagram-gallery";
import { business } from "@/data/business";
import { availability, launchNotice } from "@/data/availability";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "Good Hair. Good Vibes. Right in Your Neighborhood.",
  description:
    "Meet Elisabeth, your neighborhood hairstylist with over 10 years of experience. Explore cuts, color, extensions, and family hair days in Suncrest, Draper, Utah.",
  alternates: { canonical: "/" },
};

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
            Good Hair. Good Vibes.
            <br />
            <span className="text-primary">Right in Your Neighborhood.</span>
          </h1>
          <Button
            nativeButton={false}
            render={<Link href="/contact" />}
            className="mt-5 min-h-12 px-5"
          >
            Get in touch with Elisabeth <ArrowUpRight aria-hidden="true" />
          </Button>
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
        <p>
          Hey, neighbor! I’m Elisabeth — your friendly neighborhood hairstylist
          with over 10 years of experience, a love for beautiful hair, and a
          Subaru full of styling tools.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/contact" />}
          className="h-11 gap-2 rounded-sm px-4 text-xs"
        >
          Say hello before launch <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>

      <section
        className={`site-container ${styles.welcome}`}
        aria-labelledby="welcome-heading"
      >
        <div>
          <p className="eyebrow">Great Hair Travels.</p>
          <h2
            id="welcome-heading"
            className="mt-4 text-4xl tracking-[-.04em] sm:text-5xl"
          >
            Your Hair. Your Space. Your Kind of Day.
          </h2>
        </div>
        <div className="space-y-5 text-sm leading-8 text-muted-foreground">
          <p>
            Whether you’re looking for a fresh haircut, gorgeous color,
            extensions, or a family hair day, I’m here to make great hair a
            little more convenient and a lot more fun.
          </p>
          <p>
            Life gets busy. Between work, kids, errands, and everything else,
            finding time for a haircut can feel like another chore. HairnThere
            is all about making hair appointments feel easy, comfortable, and
            something to look forward to.
          </p>
          <p className="font-medium text-foreground">
            Come for the hair. Stay for the laughs. Leave feeling fabulous.
          </p>
          <nav
            aria-label="Explore HairnThere"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            <Link
              href="/services"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Explore Services{" "}
              <ArrowUpRight className="inline size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#about"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Meet Your Stylist{" "}
              <ArrowUpRight className="inline size-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </section>

      <section
        id="services"
        className={`site-container ${styles.section}`}
        aria-labelledby="services-heading"
      >
        <ServiceGuide headingId="services-heading" />
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
                  Family Hair Days
                  <br />
                  One happy household.
                </h2>
              </div>
              <div className="max-w-sm">
                <p className="text-xs leading-7 text-muted-foreground">
                  Multiple haircuts, one happy household. Tell us how many
                  people need a cut or color, and we’ll put together a plan for
                  your household.
                </p>
                <Button
                  nativeButton={false}
                  render={<Link href="#inquiry" />}
                  variant="outline"
                  className="mt-4 h-11 px-4 text-xs"
                >
                  Tell me about your family <ArrowUpRight aria-hidden="true" />
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
        <div className={styles.about}>
          <div className={styles.portraits}>
            <Image
              src="/Elisabeth/subaru.jpeg"
              alt="Elisabeth smiling in her Subaru"
              width={1080}
              height={1920}
              sizes="(max-width: 767px) 65vw, 27vw"
              className={styles.portrait}
            />
            <Image
              src="/Elisabeth/sundance.jpeg"
              alt="Elisabeth in a black dress beneath wooden beams and string lights at Sundance"
              width={1152}
              height={2048}
              sizes="(max-width: 767px) 40vw, 17vw"
              className={styles.sundance}
            />
          </div>
          <div className="space-y-5 text-sm leading-8 text-muted-foreground">
            <p className="eyebrow">Meet Elisabeth</p>
            <h2
              id="about-heading"
              className="mt-4 text-4xl leading-tight tracking-[-.04em] text-foreground sm:text-5xl"
            >
              Hey, I’m Elisabeth!
            </h2>
            <p>
              I’ve been doing hair for over a decade, and my favorite part has
              always been the people in my chair.
            </p>
            <p>
              I love getting to know my clients, hearing their stories, sharing
              a few laughs, and helping them feel like the best version of
              themselves.
            </p>
            <p>
              HairnThere was born from a simple idea: great hair shouldn’t have
              to be complicated. And if that means loading my Subaru with
              hairbrushes and heading into the mountains, well… great hair
              travels!
            </p>
            <p className="font-medium text-foreground">
              Can’t wait to meet you, neighbor! 💗
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
