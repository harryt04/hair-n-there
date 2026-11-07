import type { Metadata } from "next";
import { ServiceGuide } from "@/components/site/service-guide";
import { launchNotice } from "@/data/availability";

export const metadata: Metadata = {
  title: "Find your next hair day",
  description:
    "Start with your hair goal. Explore a few relevant haircuts, color, styling, or family bundles, or talk to Elisabeth directly.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="site-container max-w-3xl py-10 sm:py-14">
      <ServiceGuide pageHeading />
      <p className="mt-6 text-xs leading-6 text-muted-foreground">
        {launchNotice}
      </p>
    </main>
  );
}
