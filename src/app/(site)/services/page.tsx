import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, serviceCategories } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore cuts, color, styling, and extensions with HairnThere. Tell Elisabeth about your household for a personal house-call quote.",
  alternates: { canonical: "/services" },
};
const categoryId = (category: string) =>
  category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/g, "");

export default function ServicesPage() {
  return (
    <main id="main-content" className="site-container py-12 sm:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">
          A Little Hair. A Little There. A Lot of Happy.
        </p>
        <h1 className="heading-display mt-5 text-5xl sm:text-6xl">
          Fresh hair.
          <br />
          Good vibes.
        </h1>
        <p className="mt-6 text-sm leading-8 text-muted-foreground">
          Explore the possibilities, then tell us about your people. Elisabeth
          or her team will discuss your services, location, and a personal quote
          before you confirm a visit.
        </p>
      </div>
      <nav
        aria-label="Service categories"
        className="my-9 flex flex-wrap gap-2"
      >
        {serviceCategories.map((category) => (
          <a
            key={category}
            href={`#${categoryId(category)}`}
            className="rounded-lg border border-border px-4 py-3 text-xs hover:bg-muted"
          >
            {category}
          </a>
        ))}
      </nav>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {serviceCategories.map((category) => (
          <section
            key={category}
            id={categoryId(category)}
            aria-labelledby={`heading-${categoryId(category)}`}
          >
            <h2
              id={`heading-${categoryId(category)}`}
              className="mb-5 text-3xl"
            >
              {category}
            </h2>
            <div className="divide-y divide-border border-y border-border">
              {services
                .filter((service) => service.category === category)
                .map((service) => (
                  <div key={service.id} className="py-4">
                    <h3 className="font-sans text-sm font-medium">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
      <section
        className="mt-14 max-w-2xl border-t border-border pt-9"
        aria-labelledby="family-heading"
      >
        <h2 id="family-heading" className="text-3xl">
          Family Hair Days. One happy household.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Whether it’s one person or a full household, share how many people
          would like haircuts or color. Family and neighborhood-day pricing are
          discussed individually, with any travel cost applied once per
          household rather than per person. Extension hair is priced separately
          from installation.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/contact" />}
          className="mt-6 h-12 px-6"
        >
          Let’s plan your visit <ArrowUpRight aria-hidden="true" />
        </Button>
      </section>
    </main>
  );
}
