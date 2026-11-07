import Link from "next/link";
import { inquiryNotice } from "@/data/availability";

export function FrequentlyAskedQuestions() {
  return (
    <div className="divide-y divide-border border-y border-border">
      <details className="py-1">
        <summary className="cursor-pointer py-4 text-sm font-medium">
          How do I arrange an appointment?
        </summary>
        <p className="pb-5 text-sm leading-7 text-muted-foreground">
          {inquiryNotice} I’ll follow up personally to confirm the services,
          location, and date that work for you.
        </p>
      </details>
      <details className="py-1">
        <summary className="cursor-pointer py-4 text-sm font-medium">
          How does pricing work?
        </summary>
        <p className="pb-5 text-sm leading-7 text-muted-foreground">
          Explore services with the guided chooser, or view the full pricing
          menu. I’ll confirm your personal quote with you. Prices marked + may
          increase for extra product, length, density, or complexity. House
          calls require $60 in services before travel, with a travel fee once
          per household. Extension hair is additional.
        </p>
      </details>
      <details className="py-1">
        <summary className="cursor-pointer py-4 text-sm font-medium">
          Where can we plan a visit?
        </summary>
        <p className="pb-3 text-sm leading-7 text-muted-foreground">
          HairnThere is based in Suncrest, in Draper, Utah. House-call inquiries
          are welcome around Draper, Highland, Alpine, and surrounding
          communities; we’ll confirm your address and availability together.
        </p>
        <p className="pb-5 text-sm leading-7 text-muted-foreground">
          For salon arrangements or{" "}
          <Link
            href="/contact?visit=event"
            className="underline underline-offset-4"
          >
            special events
          </Link>
          , get in touch so we can discuss the location and services.
        </p>
      </details>
    </div>
  );
}
