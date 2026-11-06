import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceCategoryMenu } from "@/components/site/service-category-menu";
import styles from "./services.module.css";
import { Button } from "@/components/ui/button";
import { services, serviceCategories } from "@/data/services";
import { familyPackages } from "@/data/packages";
import { launchNotice } from "@/data/availability";
import { formatMoney } from "@/lib/quote";
import type { ServiceDefinition } from "@/lib/quote-types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Hey Neighbor, Let’s Do Your Hair! Explore prices, estimated durations, and happy hair bundles. Send Elisabeth an inquiry before launch.",
  alternates: { canonical: "/services" },
};
const categoryId = (category: string) =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function servicePrice(service: ServiceDefinition) {
  if (service.pricingKind === "free_consultation") return "Complimentary";
  if (service.unitPriceCents === null) return "Consultation";
  return (
    formatMoney(service.unitPriceCents) +
    (service.pricingKind === "from"
      ? "+"
      : service.pricingKind === "per_row"
        ? "/row"
        : "") +
    (service.id === "tape-in-installation" ? " labor" : "")
  );
}

function InquiryButton({ href, name }: { href: string; name: string }) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={href} aria-label={`I’m Interested! — ${name}`} />}
      variant="outline"
      className="mt-4 min-h-12 w-full sm:w-auto"
    >
      I’m Interested! <ArrowUpRight aria-hidden="true" />
    </Button>
  );
}

export default function ServicesPage() {
  return (
    <main id="main-content" className="site-container py-12 sm:py-20">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>HairnThere services</p>
        <h1 className="heading-display mt-5 text-3xl sm:text-5xl">
          Hey Neighbor, Let’s Do Your Hair!
        </h1>
        <p className="mt-6 text-lg leading-8">
          Fresh cuts, beautiful color, and happy hair days. Great hair travels!
        </p>
        <p className="mt-4 text-sm leading-7">
          Pick a little refresh or dream up something new. I’ll personally help
          you plan your hair day and confirm your quote.
        </p>
        <p className={styles.notice}>
          {launchNotice} Every request starts a conversation, never a
          reservation.
        </p>
      </div>
      <div id="service-menu" className="pt-8">
        <h2 className="text-2xl">What are you dreaming of?</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Choose a category to jump to the services, or explore a family bundle.
        </p>
        <ServiceCategoryMenu onServicesPage />
      </div>
      <section
        id="family-hair-days"
        aria-labelledby="family-heading"
        className="mb-14 rounded-xl border border-border bg-muted/40 p-5 sm:p-8"
      >
        <p className="eyebrow">
          A Little Hair, A Little There, A Lot of Happy!
        </p>
        <h2 id="family-heading" className="mt-4 text-3xl">
          Family Hair Days & happy little bundles
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Great hair days are even better when you bundle them! A little
          self-care or fresh cuts for the crew, with less running around.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {familyPackages.map((pack) => (
            <article
              key={pack.id}
              className="flex flex-col rounded-lg border border-border bg-card p-5"
            >
              <h3 className="text-xl">
                {pack.name === "family-trim"
                  ? "Family Hair Day — Family Trim"
                  : pack.name}
              </h3>
              <p className="mt-3 text-xl font-semibold">
                {formatMoney(pack.priceCents)}
                {pack.startingPrice ? "+" : ""}
              </p>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                {pack.inclusions}
              </p>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Timing confirmed during consultation. Package charged once;
                included services aren’t charged again.
              </p>
              <InquiryButton
                href={`/contact?package=${pack.id}`}
                name={pack.name}
              />
            </article>
          ))}
        </div>
      </section>
      <div className="mb-10 max-w-3xl space-y-3 text-sm leading-7 text-muted-foreground">
        <p>
          Prices marked + are starting prices and may increase for extra
          product, hair length, density, or complexity. I’ll confirm your
          personal quote before any appointment.
        </p>
        <p>
          Times are estimates, not reserved slots. Extension hair is additional.
          Add-ons accompany another service; per-row prices apply to each row.
        </p>
      </div>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {serviceCategories.map((category) => (
          <section
            key={category}
            id={categoryId(category)}
            aria-labelledby={`heading-${categoryId(category)}`}
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 id={`heading-${categoryId(category)}`} className="text-3xl">
                {category}
              </h2>
              <a
                href="#service-menu"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
              >
                All categories ↑
              </a>
            </div>
            {category === "Extensions" && (
              <p className="mb-4 text-sm leading-7 text-muted-foreground">
                Extensions & treatments: a little extra length, fullness, or
                care. Extension hair is priced separately.
              </p>
            )}
            <div className="divide-y divide-border border-y border-border">
              {services
                .filter((service) => service.category === category)
                .map((service) => (
                  <article key={service.id} className="py-5">
                    <h3 className="text-lg">{service.name}</h3>
                    <p className="mt-2 font-semibold">
                      {servicePrice(service)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.duration}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {service.description}
                    </p>
                    <InquiryButton
                      href={`/contact?service=${service.id}`}
                      name={service.name}
                    />
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
      <section
        className="mt-14 max-w-3xl border-t border-border pt-9"
        aria-labelledby="house-calls-heading"
      >
        <h2 id="house-calls-heading" className="text-3xl">
          How House Calls Work
        </h2>
        <ol className="mt-5 list-decimal space-y-4 pl-5 text-sm leading-7 text-muted-foreground">
          <li>
            Tell me what you’re dreaming of. Send a service inquiry and a little
            about your people. I’ll talk through your goals, timing, and a
            personal quote.
          </li>
          <li>
            Plan for at least $60 in services before travel. This is a service
            minimum, not an added surcharge. Neighborhood hair days need a
            custom quote.
          </li>
          <li>
            Travel fees are additional and charged once per household visit,
            never per person. I’ll discuss your location and confirm the fee
            with you; the website doesn’t calculate a route or travel charge.
          </li>
          <li>
            House-call appointments are coming soon, pending licensing approval.
            Today’s inquiry doesn’t book a visit, reserve a time, or confirm a
            price.
          </li>
        </ol>
        <Button
          nativeButton={false}
          render={<Link href="/contact" />}
          className="mt-6 min-h-12 px-6"
        >
          Say hello before launch <ArrowUpRight aria-hidden="true" />
        </Button>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          A personal inquiry, with no mailing-list signup.
        </p>
      </section>
    </main>
  );
}
