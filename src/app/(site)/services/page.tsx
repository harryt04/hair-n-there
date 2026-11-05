import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { services, serviceCategories } from "@/data/services";
import { familyPackages } from "@/data/packages";
import { travelBands } from "@/lib/travel";
import { formatMoney } from "@/lib/quote";
import { launchNotice } from "@/data/availability";
import type { ServiceDefinition } from "@/lib/quote-types";

export const metadata: Metadata = {
  title: "Services & prices",
  description:
    "Explore HairnThere’s haircut, styling, color, extension, and family-package menu. Consultations and interest inquiries with Elisabeth in Suncrest, Draper, Utah.",
  alternates: { canonical: "/services" },
};
function priceLabel(service: ServiceDefinition) {
  if (service.pricingKind === "consultation_required") return "Consultation";
  if (service.pricingKind === "free_consultation") return "Free";
  return `${formatMoney(service.unitPriceCents ?? 0)}${service.pricingKind === "from" ? "+" : service.pricingKind === "per_row" ? "/row" : ""}`;
}
function categoryId(category: string) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/g, "");
}
export default function ServicesPage() {
  return (
    <main id="main-content">
      <section className="border-b border-border bg-muted/40">
        <div className="site-container py-14 sm:py-20">
          <p className="eyebrow">The menu · A personal starting point</p>
          <h1 className="heading-display mt-5 text-5xl sm:text-7xl">
            Something beautiful,
            <br />
            <span className="italic text-secondary">for every chapter.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-muted-foreground">
            A fresh cut. A little dimension. Something for the whole family.
            Explore Elisabeth’s services, then share what you’re imagining.
          </p>
          <p className="mt-5 max-w-xl rounded-xl border border-border bg-background/70 px-4 py-3 text-xs leading-6 text-muted-foreground">
            {launchNotice} This is a service menu, not an appointment
            reservation.
          </p>
        </div>
      </section>
      <nav
        aria-label="Service categories"
        className="site-container flex flex-wrap gap-2 py-7"
      >
        {serviceCategories.map((category) => (
          <a
            key={category}
            href={`#${categoryId(category)}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs transition-colors hover:bg-muted"
          >
            {category}
          </a>
        ))}
        <a
          href="#family-packages"
          className="rounded-full border border-border bg-card px-4 py-2 text-xs hover:bg-muted"
        >
          Family packages
        </a>
        <a
          href="#travel"
          className="rounded-full border border-border bg-card px-4 py-2 text-xs hover:bg-muted"
        >
          House-call fees
        </a>
      </nav>
      <div className="site-container grid gap-10 pb-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
        {serviceCategories.map((category, index) => (
          <section
            key={category}
            id={categoryId(category)}
            className="min-w-0 scroll-mt-8"
            aria-labelledby={`heading-${categoryId(category)}`}
          >
            <div className="mb-5 flex items-baseline gap-3">
              <span className="text-[10px] tracking-widest text-secondary">
                0{index + 1}
              </span>
              <h2
                id={`heading-${categoryId(category)}`}
                className="text-3xl sm:text-4xl"
              >
                {category}
              </h2>
            </div>
            <Card className="gap-0 overflow-hidden border border-border py-0 shadow-none ring-0">
              <CardContent className="divide-y divide-border px-0">
                {services
                  .filter((s) => s.category === category)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6"
                    >
                      <div className="min-w-0">
                        <h3 className="font-sans text-sm font-medium leading-6">
                          {service.name}
                        </h3>
                        <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                          {service.description}
                        </p>
                        <Link
                          href={`/quote?service=${encodeURIComponent(service.id)}`}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary underline-offset-4 hover:underline"
                        >
                          Add to my plan{" "}
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        </Link>
                      </div>
                      <span className="shrink-0 pt-1 font-display text-lg text-primary sm:text-xl">
                        {priceLabel(service)}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
      <section
        id="family-packages"
        className="border-y border-border bg-muted/50"
        aria-labelledby="family-heading"
      >
        <div className="site-container py-14 sm:py-18">
          <p className="eyebrow">Bring everyone along</p>
          <h2 id="family-heading" className="mt-4 text-4xl sm:text-5xl">
            Your whole family.
            <br />
            <span className="text-secondary italic">One thoughtful plan.</span>
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            Planned house-call packages, with one separate convenience fee per
            household appointment. House-call appointments are not open yet.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {familyPackages.map((pack) => (
              <Card
                key={pack.id}
                className="border border-border bg-card py-6 shadow-none ring-0"
              >
                <CardContent className="flex h-full flex-col px-6">
                  <Users
                    className="mb-5 size-5 text-secondary"
                    aria-hidden="true"
                    strokeWidth={1.4}
                  />
                  <h3 className="text-2xl">{pack.name}</h3>
                  <p className="mt-3 font-display text-4xl text-primary">
                    {formatMoney(pack.priceCents)}
                  </p>
                  <p className="mt-4 text-xs leading-7 text-muted-foreground">
                    {pack.inclusions}
                  </p>
                  {pack.needsConfirmation && (
                    <Badge
                      variant="outline"
                      className="mt-3 h-auto whitespace-normal py-1 text-[10px]"
                    >
                      Women’s cut type to confirm
                    </Badge>
                  )}
                  <Link
                    href={`/quote?package=${pack.id}`}
                    className="mt-6 inline-flex items-center gap-2 pt-2 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Explore this plan{" "}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-muted-foreground">
            Children’s cuts are ages 0–12. Teen cuts are separate. Mommy & Me
            includes the women’s haircut + blow-dry. Package substitutions need
            confirmation. Extension hair is priced separately from installation
            services.
          </p>
        </div>
      </section>
      <section
        id="travel"
        className="site-container grid gap-9 py-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-16"
        aria-labelledby="travel-heading"
      >
        <div>
          <MapPin
            className="mb-5 size-6 text-secondary"
            aria-hidden="true"
            strokeWidth={1.4}
          />
          <p className="eyebrow">A future house-call day</p>
          <h2 id="travel-heading" className="mt-4 text-4xl">
            A little travel.
            <br />
            <span className="italic text-secondary">One household fee.</span>
          </h2>
          <p className="mt-5 text-sm leading-8 text-muted-foreground">
            These are the planned convenience-fee bands for house calls around
            Suncrest in Draper, Highland, Alpine, and surrounding communities.
            Fees apply once per household, not per person.
          </p>
          <p className="mt-4 text-xs leading-7 text-muted-foreground">
            Fees use estimated driving time from our Suncrest service base.
            Final travel pricing is confirmed before an appointment. City names
            are examples, not guaranteed fees. A live address calculator isn’t
            enabled yet; your travel fee remains to be confirmed.
          </p>
        </div>
        <div className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">
                Planned household convenience fees, with final route pricing
                confirmed individually
              </caption>
              <thead className="bg-muted/60 text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">Drive-time band</th>
                  <th className="px-5 py-4 text-right font-medium">
                    One household
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {travelBands.map((band) => (
                  <tr key={band.label}>
                    <td className="px-5 py-4">
                      <span className="font-medium">{band.label}</span>
                      <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
                        {band.areaExample}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-display text-lg text-primary">
                      {band.feeCents === null
                        ? "Custom quote"
                        : formatMoney(band.feeCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-5">
            <p className="text-sm font-medium">
              $60 minimum in services, before travel.
            </p>
            <p className="mt-2 text-xs leading-7 text-muted-foreground">
              For a $35 service, add $25 in services to reach the planned
              house-call minimum. We won’t silently add a minimum surcharge.
              Free consultation location and format are arranged separately.
            </p>
          </div>
        </div>
      </section>
      <section className="site-container pb-16">
        <div className="flex flex-col items-start justify-between gap-7 rounded-2xl bg-muted px-7 py-9 md:flex-row md:items-center">
          <div>
            <Sparkles
              className="mb-4 size-5 text-secondary"
              aria-hidden="true"
            />
            <h2 className="text-3xl">A good hair day, on your block.</h2>
            <p className="mt-3 max-w-xl text-xs leading-7 text-muted-foreground">
              Interested in a neighborhood haircut day? Tell Elisabeth about
              your group. Future availability and reduced travel fees will be
              discussed individually.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/contact?topic=neighborhood" />}
            className="h-12 shrink-0 px-6 text-xs"
          >
            Ask about a neighborhood day <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      </section>
    </main>
  );
}
