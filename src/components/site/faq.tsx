import Link from "next/link";

export function FrequentlyAskedQuestions() {
  return (
    <div className="divide-y divide-border border-y border-border">
      <details className="py-1">
        <summary className="cursor-pointer py-4 text-sm font-medium">
          How will pricing work?
        </summary>
        <p className="pb-5 text-sm leading-7 text-muted-foreground">
          We’ll put together a personal quote based on your group, services, and
          location. Any family pricing or household travel cost will be
          discussed before you confirm. Extension hair is priced separately.
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
