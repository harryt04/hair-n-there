"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ContactForm,
  VisitChoice,
  type InquiryContext,
} from "@/components/contact/contact-form";
import { QuoteSummary } from "@/components/quote/quote-summary";
import {
  services,
  formatMoney,
  type ServiceId,
  type VisitType,
} from "@/lib/quote";
import { trackEvent } from "@/components/site/telemetry";

const areas = {
  suncrest: "SunCrest",
  nearby: "A nearby community",
  other: "Somewhere else",
};

export function QuoteEntry() {
  const search = useSearchParams();
  const initialVisit: VisitType =
    search.get("visit") === "salon" ? "salon" : "house";
  return <QuoteFlow key={initialVisit} initialVisit={initialVisit} />;
}

function QuoteFlow({ initialVisit }: { initialVisit: VisitType }) {
  const [visitType, setVisitType] = useState<VisitType>(initialVisit);
  const [quantities, setQuantities] = useState<Record<ServiceId, number>>({
    haircut: 1,
    color: 0,
    extensions: 0,
    styling: 0,
  });
  const [areaChoice, setAreaChoice] = useState<keyof typeof areas>("suncrest");
  const [areaDetail, setAreaDetail] = useState("");
  const [step, setStep] = useState<"services" | "contact">("services");
  const [selectionError, setSelectionError] = useState("");
  const tracked = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selections = services
    .filter((s) => quantities[s.id] > 0)
    .map((s) => ({ id: s.id, quantity: quantities[s.id] }));
  const context: InquiryContext = {
    visitType,
    services: selections,
    area:
      visitType === "house"
        ? areaChoice === "suncrest"
          ? "SunCrest"
          : areaDetail.trim() || areas[areaChoice]
        : "",
  };

  function trackStart() {
    if (!tracked.current) {
      trackEvent("quote_started");
      tracked.current = true;
    }
  }
  function changeQuantity(id: ServiceId, increment: number) {
    trackStart();
    setSelectionError("");
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(20, current[id] + increment)),
    }));
  }
  function continueToContact() {
    trackStart();
    if (!selections.length) {
      setSelectionError(
        "Choose at least one service, or send a general inquiry instead.",
      );
      return;
    }
    setStep("contact");
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  function backToServices() {
    setStep("services");
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  return (
    <div>
      <div className="mb-9 max-w-2xl sm:mb-12">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
          {step === "services" ? "01 · Your appointment" : "02 · Say hello"}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-display text-5xl leading-[1.08] tracking-[-0.035em] outline-none sm:text-6xl"
        >
          {step === "services" ? (
            <>
              A good hair day
              <br />
              starts here.
            </>
          ) : (
            <>
              Let’s make it
              <br />
              <span className="text-secondary italic">your kind of hair.</span>
            </>
          )}
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
          {step === "services"
            ? "One fresh cut or a house full? Choose your services, then share your plans with Elisabeth for a personal quote."
            : "Share a few details and Elisabeth can follow up about your appointment. Sending an inquiry doesn’t reserve a time."}
        </p>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] lg:gap-8">
        <div className="min-w-0">
          <div hidden={step !== "services"}>
            <Card className="border border-border py-6 shadow-none ring-0 sm:py-8">
              <CardContent className="px-5 sm:px-8">
                <h2 className="mb-6 font-display text-2xl sm:text-3xl">
                  What works for you?
                </h2>
                <VisitChoice
                  value={visitType}
                  onChange={(next) => {
                    trackStart();
                    setVisitType(next);
                  }}
                />
                <fieldset className="mt-3 min-w-0">
                  <legend className="sr-only">
                    Select services and number of people
                  </legend>
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between gap-4 border-b border-border py-6"
                    >
                      <div className="min-w-0">
                        <Label
                          htmlFor={`quantity-${service.id}`}
                          className="font-semibold"
                        >
                          {service.name}
                        </Label>
                        <p className="mt-2 max-w-72 text-xs leading-6 text-muted-foreground">
                          {service.description}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-secondary">
                          {service.unitPriceCents !== null
                            ? `${formatMoney(service.unitPriceCents)} per person`
                            : service.consultation
                              ? "Consultation · personal pricing"
                              : "Price confirmed by Elisabeth"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-border bg-background">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-10 rounded-none"
                          disabled={quantities[service.id] === 0}
                          aria-label={`Remove one ${service.name.toLowerCase()} appointment`}
                          onClick={() => changeQuantity(service.id, -1)}
                        >
                          <Minus className="size-3.5" aria-hidden="true" />
                        </Button>
                        <output
                          id={`quantity-${service.id}`}
                          className="min-w-8 text-center text-sm tabular-nums"
                          aria-label={`${service.name} quantity`}
                          aria-live="polite"
                        >
                          {quantities[service.id]}
                        </output>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-10 rounded-none"
                          disabled={quantities[service.id] === 20}
                          aria-label={`Add one ${service.name.toLowerCase()} appointment`}
                          onClick={() => changeQuantity(service.id, 1)}
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </fieldset>
                {visitType === "house" && (
                  <div className="mt-6 space-y-3">
                    <Label id="area-label">Where should we meet?</Label>
                    <Select
                      value={areaChoice}
                      onValueChange={(value) => {
                        if (value && value in areas)
                          setAreaChoice(value as keyof typeof areas);
                      }}
                      items={areas}
                    >
                      <SelectTrigger
                        aria-labelledby="area-label"
                        className="h-12! w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(areas).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {areaChoice !== "suncrest" && (
                      <div className="space-y-2">
                        <Label htmlFor="quote-area" className="text-xs">
                          City or neighborhood · optional
                        </Label>
                        <Input
                          id="quote-area"
                          value={areaDetail}
                          onChange={(e) => setAreaDetail(e.target.value)}
                          maxLength={120}
                          placeholder="Where are you based?"
                          className="h-12"
                        />
                      </div>
                    )}
                    <p className="text-xs leading-6 text-muted-foreground">
                      No street address needed yet. Travel fees and the service
                      area will be confirmed with you.
                    </p>
                  </div>
                )}
                {selectionError && (
                  <p
                    role="alert"
                    className="mt-5 text-sm leading-6 text-destructive"
                  >
                    {selectionError}{" "}
                    <Link
                      href="/contact"
                      className="underline underline-offset-4"
                    >
                      Say hello
                    </Link>
                    .
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <div hidden={step !== "contact"}>
            <ContactForm context={context} onBack={backToServices} />
          </div>
        </div>
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <QuoteSummary
            context={context}
            showContinue={step === "services"}
            onContinue={continueToContact}
          />
          {step === "services" && (
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/" />}
              className="mt-4 h-11 w-full text-muted-foreground"
            >
              <ArrowLeft aria-hidden="true" /> Keep exploring
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}
