import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteEntry } from "@/components/quote/quote-flow";

export const metadata: Metadata = {
  title: "Your service wish list",
  description:
    "Explore HairnThere service prices and family packages, build a personal wish list, and share your interest with Elisabeth. Appointments are not open yet.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <main id="main-content" className="site-container py-12 sm:py-16 lg:py-20">
      <Suspense
        fallback={
          <div className="min-h-[600px]" role="status">
            <p className="text-sm text-muted-foreground">
              Getting your service planner ready…
            </p>
          </div>
        }
      >
        <QuoteEntry />
      </Suspense>
    </main>
  );
}
