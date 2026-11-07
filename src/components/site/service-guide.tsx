import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceGuidePaths } from "@/data/service-guide";
import { services } from "@/data/services";
import { familyPackages } from "@/data/packages";
import { formatMoney } from "@/lib/quote";
import { ServiceGuideControls } from "./service-guide-controls";
import styles from "./service-guide.module.css";

export function ServiceGuide({
  headingId = "service-guide-heading",
  pageHeading = false,
}: {
  headingId?: string;
  pageHeading?: boolean;
}) {
  const Heading = pageHeading ? "h1" : "h2";
  return (
    <div className={styles.guide}>
      <p className="eyebrow">Good hair starts here</p>
      <Heading id={headingId} className={styles.heading}>
        What would feel good?
      </Heading>
      <p className={styles.introduction}>
        Start with your hair goal. Or skip the choices and say hello.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/contact" />}
        variant="link"
        className={styles.skip}
      >
        I’d rather talk to Elisabeth <ArrowUpRight aria-hidden="true" />
      </Button>
      <ServiceGuideControls>
        {serviceGuidePaths.map((path) => (
          <div key={path.id}>
            <ul
              className={styles.services}
              aria-label={`${path.label} services`}
            >
              {path.services.map((id) => {
                const service = services.find((item) => item.id === id)!;
                const price =
                  service.pricingKind === "free_consultation"
                    ? "Complimentary"
                    : service.unitPriceCents === null
                      ? "Consultation"
                      : formatMoney(service.unitPriceCents) +
                        (service.pricingKind === "from"
                          ? "+"
                          : service.pricingKind === "per_row"
                            ? "/row"
                            : "") +
                        (service.id === "tape-in-installation" ? " labor" : "");
                return (
                  <li key={id} className={styles.service}>
                    <div className={styles.namePrice}>
                      <h4>{service.name}</h4>
                      <p>{price}</p>
                    </div>
                    <p className={styles.description}>
                      {service.description.split(/(?<=[.!?])\s+/)[0]}
                    </p>
                  </li>
                );
              })}
              {path.packages.map((id) => {
                const pack = familyPackages.find((item) => item.id === id)!;
                return (
                  <li key={id} className={styles.service}>
                    <div className={styles.namePrice}>
                      <h4>{pack.name}</h4>
                      <p>
                        {formatMoney(pack.priceCents)}
                        {pack.startingPrice ? "+" : ""}
                      </p>
                    </div>
                    <p className={styles.description}>{pack.inclusions}</p>
                  </li>
                );
              })}
            </ul>
            <p className={styles.priceNote}>
              + means starting at. Extension hair and travel are additional.
              Final quotes are confirmed personally.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/contact" />}
              className={styles.contact}
            >
              Ask Elisabeth about this <ArrowUpRight aria-hidden="true" />
            </Button>
            <details className={styles.details}>
              <summary>Full service details</summary>
              <ul className={styles.detailList}>
                {path.services.map((id) => {
                  const service = services.find((item) => item.id === id)!;
                  return (
                    <li key={id}>
                      <Link href={`/contact?service=${id}`}>
                        {service.name} ↗
                      </Link>
                      <p>
                        {service.description} {service.duration}.
                      </p>
                    </li>
                  );
                })}
                {path.packages.map((id) => {
                  const pack = familyPackages.find((item) => item.id === id)!;
                  return (
                    <li key={id}>
                      <Link href={`/contact?package=${id}`}>{pack.name} ↗</Link>
                      <p>
                        Timing confirmed during consultation. Bundle charged
                        once; additional services are extra.
                      </p>
                    </li>
                  );
                })}
              </ul>
              <Link href="/pricing" className={styles.fullMenu}>
                Browse the complete menu & pricing ↗
              </Link>
            </details>
          </div>
        ))}
      </ServiceGuideControls>
    </div>
  );
}
