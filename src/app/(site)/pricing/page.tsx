import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, serviceCategories } from "@/data/services";
import { familyPackages } from "@/data/packages";
import { launchNotice } from "@/data/availability";
import { formatMoney } from "@/lib/quote";
import type { ServiceDefinition } from "@/lib/quote-types";
import styles from "./pricing.module.css";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Browse HairnThere’s haircuts, color, styling, extensions, and family bundles. Explore service prices and ask Elisabeth for a personal quote.",
  alternates: { canonical: "/pricing" },
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

function ContactButton() {
  return (
    <Button
      nativeButton={false}
      render={<Link href="/contact" />}
      className="min-h-12 px-5"
    >
      Get in touch with Elisabeth <ArrowUpRight aria-hidden="true" />
    </Button>
  );
}

export default function PricingPage() {
  return (
    <main id="main-content" className={`site-container ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">The HairnThere menu</p>
        <h1 className="heading-display mt-4 text-4xl sm:text-5xl">
          Services & pricing
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Find your next refresh. I’ll confirm your personal quote before any
          appointment.
        </p>
        <div className="mt-5">
          <ContactButton />
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          {launchNotice}
        </p>
      </header>
      <nav
        id="pricing-menu"
        aria-label="Pricing categories"
        className={styles.navigation}
      >
        {serviceCategories.map((category) => (
          <a key={category} href={`#${categoryId(category)}`}>
            {category}
          </a>
        ))}
        <a href="#family-hair-days">Family & bundles</a>
      </nav>
      <p className="mb-8 text-sm leading-7 text-muted-foreground">
        + means starting at. Extension hair and travel are additional.
      </p>
      <div className={styles.categories}>
        {serviceCategories.map((category) => (
          <section
            key={category}
            id={categoryId(category)}
            aria-labelledby={`heading-${categoryId(category)}`}
          >
            <div className={styles.sectionHeading}>
              <h2 id={`heading-${categoryId(category)}`} className="text-2xl">
                {category}
              </h2>
              <a href="#pricing-menu">All categories ↑</a>
            </div>
            <div>
              {services
                .filter((service) => service.category === category)
                .map((service) => (
                  <article key={service.id} className={styles.row}>
                    <div className={styles.namePrice}>
                      <h3>{service.name}</h3>
                      <p>{servicePrice(service)}</p>
                    </div>
                    <p className={styles.description}>{service.description}</p>
                    <details className={styles.details}>
                      <summary>
                        Details
                        <span className="sr-only"> for {service.name}</span>
                      </summary>
                      <div className={styles.detailContent}>
                        <p>Estimated time: {service.duration}.</p>
                        {service.consultation && (
                          <p>
                            We’ll talk through your goals before confirming a
                            plan.
                          </p>
                        )}
                        {service.unit === "row" && (
                          <p>
                            Price applies to each row. Extension hair is
                            additional.
                          </p>
                        )}
                        <Link
                          href={`/contact?service=${service.id}`}
                          className={styles.inquiry}
                        >
                          Ask about this service{" "}
                          <ArrowUpRight aria-hidden="true" size={16} />
                        </Link>
                      </div>
                    </details>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
      <section
        id="family-hair-days"
        aria-labelledby="family-heading"
        className="mt-12"
      >
        <div className={styles.sectionHeading}>
          <h2 id="family-heading" className="text-2xl">
            Family Hair Days & bundles
          </h2>
          <a href="#pricing-menu">All categories ↑</a>
        </div>
        {familyPackages.map((pack) => (
          <article key={pack.id} className={styles.row}>
            <div className={styles.namePrice}>
              <h3>{pack.name}</h3>
              <p>
                {formatMoney(pack.priceCents)}
                {pack.startingPrice ? "+" : ""}
              </p>
            </div>
            <p className={styles.description}>{pack.inclusions}</p>
            <details className={styles.details}>
              <summary>
                Details<span className="sr-only"> for {pack.name}</span>
              </summary>
              <div className={styles.detailContent}>
                <p>
                  Timing confirmed during consultation. Bundle charged once;
                  additional services are extra.
                </p>
                <Link
                  href={`/contact?package=${pack.id}`}
                  className={styles.inquiry}
                >
                  Ask about this bundle{" "}
                  <ArrowUpRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </details>
          </article>
        ))}
      </section>
      <details className={`${styles.details} ${styles.policy}`}>
        <summary>Pricing & house-call details</summary>
        <div className={`${styles.detailContent} space-y-3`}>
          <p>
            Starting prices may increase with product, length, density, or
            complexity. Your final quote is confirmed personally. Times are
            estimates, not reserved slots.
          </p>
          <p>
            Extension installation prices cover labor; hair is separate. Per-row
            prices apply to each row. Add-ons accompany another service.
          </p>
          <p>
            House calls require $60 in services before travel. This is a service
            minimum, not an added surcharge. Travel is confirmed personally and
            charged once per household visit.
          </p>
          <p>
            Neighborhood hair days need a custom quote. Free
            extension-consultation format and location are confirmed together.
          </p>
          <p>
            Inquiries don’t reserve a time or confirm a price. House-call
            appointments are coming soon, pending licensing approval.
          </p>
        </div>
      </details>
      <section className={styles.closing} aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-2xl">
          Let’s find your next good hair day.
        </h2>
        <div className="mt-5">
          <ContactButton />
        </div>
      </section>
    </main>
  );
}
