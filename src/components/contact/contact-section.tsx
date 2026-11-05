import { launchNotice } from "@/data/availability";
import { business } from "@/data/business";
import { Suspense } from "react";
import { ContactEntry, ContactForm } from "@/components/contact/contact-form";

export function ContactSection({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section
      id="inquiry"
      aria-labelledby="inquiry-heading"
      className="mx-auto max-w-2xl py-12 sm:py-16"
    >
      <div className="mb-8">
        <p className="eyebrow">A good hair day starts with hello</p>
        <Heading
          id="inquiry-heading"
          className="heading-display mt-4 text-4xl sm:text-5xl"
        >
          One less thing
          <br />
          on your list.
        </Heading>
        <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
          Tell us about your people and what works for you. Elisabeth or a
          member of her team will be in touch shortly to discuss your visit and
          a personal quote.
        </p>
        <p className="mt-3 max-w-lg text-xs leading-6 text-muted-foreground">
          {launchNotice}
        </p>
      </div>
      {standalone ? (
        <Suspense
          fallback={
            <p role="status" className="text-sm">
              Getting your inquiry form ready…
            </p>
          }
        >
          <ContactEntry />
        </Suspense>
      ) : (
        <ContactForm />
      )}
      <noscript>
        <p className="mt-5 text-sm leading-7">
          The step-by-step form needs JavaScript. You can{" "}
          <a
            href={
              business.supportEmail
                ? `mailto:${business.supportEmail}`
                : business.instagramUrl
            }
            className="underline underline-offset-4"
          >
            contact HairnThere directly
          </a>{" "}
          instead.
        </p>
      </noscript>
    </section>
  );
}
