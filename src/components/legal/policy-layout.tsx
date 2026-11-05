import Link from "next/link";
import type { ReactNode } from "react";
import { business } from "@/data/business";

export function PolicyContact() {
  return business.supportEmail ? (
    <a
      className="underline underline-offset-4 hover:text-primary"
      href={`mailto:${business.supportEmail}`}
    >
      {business.supportEmail}
    </a>
  ) : (
    <Link
      className="underline underline-offset-4 hover:text-primary"
      href="/contact"
    >
      our contact form
    </Link>
  );
}

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-8 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function PolicyLayout({
  title,
  subtitle,
  children,
  otherHref,
  otherLabel,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  otherHref: string;
  otherLabel: string;
}) {
  return (
    <main id="main-content" className="site-container py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to home
        </Link>
        <div className="mt-10 border-b border-border pb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
            The important details
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            {subtitle}
          </p>
          <p className="mt-5 text-xs text-muted-foreground">
            Effective November 5, 2026
          </p>
        </div>
        <div className="space-y-10 py-10 sm:space-y-12 sm:py-12">
          {children}
        </div>
        <div className="flex flex-wrap gap-5 border-t border-border pt-6 text-xs text-muted-foreground">
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/contact"
          >
            Contact HairnThere
          </Link>
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href={otherHref}
          >
            {otherLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
