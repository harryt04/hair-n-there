import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import { ContactEntry } from "@/components/contact/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: "Say hello",
  description:
    "Ask Elisabeth about cuts, color, extensions, future house calls, salon services, or neighborhood haircut days. Consultations and interest only.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="site-container py-12 sm:py-16 lg:py-20">
      <div className="mb-9 max-w-2xl sm:mb-12">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
          Good hair starts with hello
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.08] tracking-[-0.035em] sm:text-6xl">
          Let’s make it
          <br />
          <span className="text-secondary italic">your kind of hair.</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
          A fresh cut, a new color, or a family haircut day? Share what you’re
          thinking. Consultations and interest inquiries are welcome;
          appointments are not open yet.
        </p>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] lg:gap-8">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground" role="status">
              Getting your inquiry form ready…
            </p>
          }
        >
          <ContactEntry />
        </Suspense>
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <Card className="border border-border py-7 shadow-none ring-0">
            <CardContent className="px-5 sm:px-7">
              <MessageCircle
                className="mb-6 size-6 text-secondary"
                aria-hidden="true"
              />
              <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
                What happens next
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight">
                A conversation.
                <br />
                Then a great hair day.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Elisabeth can answer your questions and discuss your ideas. A
                house-call launch or future salon location will be announced
                when ready.
              </p>
              <Separator className="my-6" />
              <p className="text-xs leading-6 text-muted-foreground">
                Texting is your choice. Leave the SMS checkbox unchecked and we
                can use your email instead.
              </p>
              <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-muted-foreground">
                <Heart
                  className="mt-1 size-3.5 shrink-0 text-secondary"
                  aria-hidden="true"
                />
                This form collects consultations and interest only. It does not
                request, reserve, or accept an appointment.
              </p>
              {business.supportEmail && (
                <a
                  href={`mailto:${business.supportEmail}`}
                  className="mt-5 inline-block break-all text-sm text-primary underline underline-offset-4"
                >
                  {business.supportEmail}
                </a>
              )}
            </CardContent>
          </Card>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/quote" />}
            className="mt-5 h-12 w-full px-4"
          >
            Build a service wish list <ArrowUpRight aria-hidden="true" />
          </Button>
        </aside>
      </div>
    </main>
  );
}
