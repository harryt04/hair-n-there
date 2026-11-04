"use client";

import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateQuote, formatMoney } from "@/lib/quote";
import type { InquiryContext } from "@/components/contact/contact-form";

export function QuoteSummary({
  context,
  onContinue,
  showContinue = false,
}: {
  context: InquiryContext;
  onContinue?: () => void;
  showContinue?: boolean;
}) {
  const quote = calculateQuote(
    context.services,
    context.visitType,
    context.area,
  );
  return (
    <Card className="border border-border py-6 shadow-none ring-0 sm:py-8">
      <CardContent className="px-5 sm:px-7">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
          Your starting point
        </p>
        <h2 className="mt-3 font-display text-3xl">The little details.</h2>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden="true" />
          {context.visitType === "house" ? "House call" : "Salon visit"}
          {context.area && context.visitType === "house"
            ? ` · ${context.area}`
            : ""}
        </p>
        <ul
          className="mt-6 space-y-5"
          aria-live="polite"
          aria-label="Selected services"
        >
          {quote.items.length ? (
            quote.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span>
                  {item.quantity} × {item.name}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {item.consultation
                      ? "Individual consultation"
                      : "Price confirmed by Elisabeth"}
                  </span>
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {item.subtotalCents === null
                    ? "To be confirmed"
                    : formatMoney(item.subtotalCents)}
                </span>
              </li>
            ))
          ) : (
            <li className="text-sm leading-6 text-muted-foreground">
              Choose your services to start a personal estimate.
            </li>
          )}
        </ul>
        <Separator className="my-6" />
        <div className="flex items-start justify-between gap-3 text-sm">
          <span>Travel fee</span>
          <span className="text-right text-muted-foreground">
            {context.visitType === "salon"
              ? "Not applicable"
              : quote.travelFeeCents === null
                ? "To be confirmed"
                : formatMoney(quote.travelFeeCents)}
          </span>
        </div>
        <Separator className="my-6" />
        <div aria-live="polite">
          <p className="text-xs text-muted-foreground">
            {quote.totalCents === null
              ? "Your personal quote"
              : "Estimated total"}
          </p>
          <p className="mt-2 font-display text-[28px] leading-tight">
            {quote.totalCents === null
              ? "Confirmed by Elisabeth"
              : formatMoney(quote.totalCents)}
          </p>
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          Every appointment is personal. Elisabeth will confirm service pricing,
          any travel fee, and availability before you book.
        </p>
        {showContinue && (
          <Button
            type="button"
            onClick={onContinue}
            className="mt-6 h-12 w-full px-5"
          >
            Next: say hello <ArrowUpRight aria-hidden="true" />
          </Button>
        )}
        <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-muted-foreground">
          <Sparkles
            className="mt-1 size-3.5 shrink-0 text-secondary"
            aria-hidden="true"
          />
          No payment or reservation is made here.
        </p>
      </CardContent>
    </Card>
  );
}
