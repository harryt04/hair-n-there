import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteEntry } from "@/components/quote/quote-flow";

export const metadata: Metadata = {
  title: "Plan your appointment",
  description:
    "Plan a HairnThere house call or salon visit. Choose services for yourself or a group and request a personal quote from Elisabeth.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <main id="main-content" className="site-container py-12 sm:py-16 lg:py-20">
      <Suspense
        fallback={
          <div className="min-h-[600px]" role="status">
            <p className="text-sm text-muted-foreground">
              Getting your appointment planner ready…
            </p>
          </div>
        }
      >
        <QuoteEntry />
      </Suspense>
    </main>
  );
}
