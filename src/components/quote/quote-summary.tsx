"use client";
import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateQuote, formatMoney } from "@/lib/quote";
import { availability } from "@/data/availability";
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
    context.packages,
  );
  const hasSelections = quote.items.length + quote.packageItems.length > 0;
  const onlyFree =
    quote.items.length > 0 &&
    !quote.packageItems.length &&
    quote.items.every((item) => item.pricingKind === "free_consultation");
  return (
    <Card className="border py-6 shadow-none ring-0 sm:py-8">
      <CardContent className="px-5 sm:px-7">
        <p className="eyebrow">Transparent from the start</p>
        <h2 className="mt-3 font-display text-3xl">Your starting point.</h2>
        <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-muted-foreground">
          <MapPin className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
          {availability[context.visitType].label}
          {context.area ? ` · ${context.area}` : ""}
        </p>
        <span className="mt-3 inline-block rounded-full bg-muted px-3 py-1 text-[10px] text-secondary">
          {availability[context.visitType].status}
        </span>
        <ul
          className="mt-6 space-y-5"
          aria-live="polite"
          aria-label="Service wish list"
        >
          {quote.packageItems.map((item) => (
            <li key={item.id} className="text-xs">
              <div className="flex justify-between gap-3">
                <span className="font-medium">
                  {item.quantity} × {item.name}
                </span>
                <span className="shrink-0 text-primary">
                  {formatMoney(item.subtotalCents)}
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                {item.inclusions}
              </p>
              {item.needsConfirmation && (
                <p className="mt-1 text-[10px] leading-5 text-secondary">
                  Women’s cut type to confirm.
                </p>
              )}
            </li>
          ))}
          {quote.items.map((item) => (
            <li key={`${item.id}:${item.member}`} className="text-xs">
              <div className="flex justify-between gap-3">
                <span>
                  {item.member && (
                    <span className="mb-1 block text-[10px] text-secondary">
                      {item.member}
                    </span>
                  )}
                  {item.quantity} × {item.name}
                  {item.unit === "row" ? " (rows)" : ""}
                </span>
                <span className="shrink-0 text-right text-primary">
                  {item.pricingKind === "free_consultation"
                    ? "Free"
                    : item.subtotalCents === null
                      ? "To discuss"
                      : `${item.pricingKind === "from" ? "From " : ""}${formatMoney(item.subtotalCents)}`}
                </span>
              </div>
            </li>
          ))}
          {!hasSelections && (
            <li className="text-xs leading-6 text-muted-foreground">
              Choose services or a package to start your personal plan.
            </li>
          )}
        </ul>
        <Separator className="my-6" />
        <div className="flex justify-between gap-3 text-xs">
          <span>
            {quote.hasStartingPrices
              ? "Starting service subtotal"
              : "Known service subtotal"}
          </span>
          <span className="shrink-0 font-semibold">
            {formatMoney(quote.knownSubtotalCents)}
          </span>
        </div>
        <div className="mt-4 flex justify-between gap-3 text-xs">
          <span>
            {context.visitType === "house"
              ? "One household travel fee"
              : "Travel"}
          </span>
          <span className="text-right text-muted-foreground">
            {onlyFree
              ? "Format to discuss"
              : quote.travelFeeCents === null
                ? "To be confirmed"
                : "Not applicable"}
          </span>
        </div>
        {quote.hasUnpricedServices && (
          <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
            Consultation-required services are not included in the numeric
            subtotal.
          </p>
        )}
        {quote.extensionHairExcluded && (
          <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
            Extension hair is priced separately.
          </p>
        )}
        <Separator className="my-6" />
        <div aria-live="polite">
          <p className="text-xs text-muted-foreground">
            {onlyFree
              ? "Extension consultation"
              : !hasSelections
                ? "Your personal plan"
                : quote.totalCents === null
                  ? "Final quote"
                  : "Planning estimate"}
          </p>
          <p className="mt-2 font-display text-[28px] leading-tight">
            {!hasSelections
              ? "Let’s make it yours."
              : onlyFree
                ? "Free · format to discuss"
                : quote.totalCents === null
                  ? "Confirmed by Elisabeth"
                  : `${quote.hasStartingPrices ? "From " : ""}${formatMoney(quote.totalCents)}`}
          </p>
        </div>
        {context.visitType === "house" && (
          <p className="mt-5 rounded-lg bg-muted p-4 text-[11px] leading-6 text-muted-foreground">
            {quote.minimum.status === "not_met"
              ? `Future house calls require $60 in services before travel. Add ${formatMoney(quote.minimum.shortfallCents)} in services to meet the minimum; no automatic surcharge is added.`
              : quote.minimum.status === "met"
                ? "The $60 service minimum is met. Travel is added once per household, separately from services."
                : "House calls have a $60 service minimum before travel. Consultation-only plans and location/format need individual confirmation."}
          </p>
        )}
        {quote.hasUnresolvedPackage && (
          <p className="mt-4 text-[11px] leading-6 text-secondary">
            Mommy & Me is listed at $75, but the included women’s cut variant
            still needs confirmation.
          </p>
        )}
        <p className="mt-5 text-xs leading-6 text-muted-foreground">
          {availability[context.visitType].message}
        </p>
        {showContinue && (
          <Button
            type="button"
            onClick={onContinue}
            className="mt-6 h-12 w-full px-5"
          >
            Ask about this plan <ArrowUpRight aria-hidden="true" />
          </Button>
        )}
        <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-muted-foreground">
          <MessageCircle
            className="mt-1 size-3.5 shrink-0 text-secondary"
            aria-hidden="true"
          />
          An interest inquiry only. No appointment, reservation, deposit, or
          payment.
        </p>
      </CardContent>
    </Card>
  );
}
