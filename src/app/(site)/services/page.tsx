import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceCategoryMenu } from "@/components/site/service-category-menu";
import { Button } from "@/components/ui/button";
import { launchNotice } from "@/data/availability";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Haircuts, color, styling, extensions, and family hair days. Tell Elisabeth what you have in mind, or explore the full pricing menu.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="site-container py-10 sm:py-14">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>HairnThere services</p>
        <h1 className="heading-display mt-5 text-3xl sm:text-5xl">
          Hey Neighbor, Let’s Do Your Hair!
        </h1>
        <p className="mt-5 text-lg leading-8">
          Fresh cuts, beautiful color, and happy hair days.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/contact" />}
            className={styles.contact}
          >
            Get in touch with Elisabeth <ArrowUpRight aria-hidden="true" />
          </Button>
          <Link href="/pricing" className={styles.pricingLink}>
            View pricing
          </Link>
        </div>
        <p className={styles.notice}>{launchNotice}</p>
      </div>
      <section aria-labelledby="service-menu" className="pt-9">
        <h2 id="service-menu" className="text-2xl">
          What are you dreaming of?
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Not sure what to choose? We’ll figure it out together.
        </p>
        <ServiceCategoryMenu includeFamily />
      </section>
    </main>
  );
}
