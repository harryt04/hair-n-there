import Link from "next/link";
import { launchNotice } from "@/data/availability";

export function FrequentlyAskedQuestions() {
  return (
    <div className="divide-y divide-border border-y border-border">
      <details className="py-1">
        <summary className="cursor-pointer py-4 text-sm font-medium">
          Can I book a house call yet?
        </summary>
        <p className="pb-5 text-sm leading-7 text-muted-foreground">
          {launchNotice} Send an inquiry to start a conversation with me.
          Submitting the form does not reserve an appointment.
        </p>
      </details>
      <details className="py-1">
        <summary className="cursor-pointer py-4 text-sm font-medium">
          How will pricing work?
        </summary>
        <p className="pb-5 text-sm leading-7 text-muted-foreground">
          Explore prices, estimated times, and bundles on the services page.
          I’ll confirm your personal quote with you. Prices marked + may
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
          A salon booth is still a future plan. For{" "}
          <Link
            href="/contact?visit=event"
            className="underline underline-offset-4"
          >
            special events
          </Link>
          , send a consultation inquiry so we can discuss the location and
          services.
        </p>
      </details>
    </div>
  );
}
