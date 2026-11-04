"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Minus, UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ContactForm,
  VisitChoice,
  type InquiryContext,
} from "@/components/contact/contact-form";
import { QuoteSummary } from "@/components/quote/quote-summary";
import { services, serviceCategories } from "@/data/services";
import { familyPackages } from "@/data/packages";
import { availability } from "@/data/availability";
import { formatMoney } from "@/lib/quote";
import { travelBands, travelFeeForMinutes } from "@/lib/travel";
import type {
  ServiceSelection,
  PackageSelection,
  ServiceDefinition,
  VisitType,
} from "@/lib/quote-types";
import { trackEvent } from "@/components/site/telemetry";

function servicePrice(service: ServiceDefinition) {
  if (service.pricingKind === "free_consultation") return "Free";
  if (service.unitPriceCents === null) return "Consultation";
  return `${formatMoney(service.unitPriceCents)}${service.pricingKind === "from" ? "+" : service.unit === "row" ? "/row" : ""}`;
}
export function QuoteEntry() {
  const search = useSearchParams();
  const visit = search.get("visit");
  const initialVisit: VisitType =
    visit === "salon" || visit === "event" ? visit : "house";
  const service = services.find(
    (item) => item.id === search.get("service"),
  )?.id;
  const pack = familyPackages.find(
    (item) => item.id === search.get("package"),
  )?.id;
  return (
    <QuoteFlow
      key={`${initialVisit}:${service ?? ""}:${pack ?? ""}`}
      initialVisit={initialVisit}
      initialService={service}
      initialPackage={pack}
    />
  );
}
function QuoteFlow({
  initialVisit,
  initialService,
  initialPackage,
}: {
  initialVisit: VisitType;
  initialService?: string;
  initialPackage?: string;
}) {
  const [visitType, setVisitType] = useState<VisitType>(initialVisit);
  const [members, setMembers] = useState(["Person 1"]);
  const [activeMember, setActiveMember] = useState("Person 1");
  const [selections, setSelections] = useState<ServiceSelection[]>(
    initialService
      ? [{ id: initialService, quantity: 1, member: "Person 1" }]
      : [],
  );
  const [packages, setPackages] = useState<PackageSelection[]>(
    initialPackage ? [{ id: initialPackage, quantity: 1 }] : [],
  );
  const [area, setArea] = useState("");
  const [step, setStep] = useState<"services" | "contact">("services");
  const [error, setError] = useState("");
  const [minutes, setMinutes] = useState(8);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tracked = useRef(false);
  const context: InquiryContext = {
    visitType,
    area,
    services: selections,
    packages,
    intent: "interest",
  };
  function trackStart() {
    if (!tracked.current) {
      trackEvent("quote_started");
      tracked.current = true;
    }
  }
  function addService(id: string) {
    trackStart();
    setError("");
    setSelections((current) => {
      const existing = current.find(
        (line) => line.id === id && line.member === activeMember,
      );
      if (existing)
        return current.map((line) =>
          line === existing
            ? { ...line, quantity: Math.min(20, line.quantity + 1) }
            : line,
        );
      return current.length >= 60
        ? current
        : [...current, { id, quantity: 1, member: activeMember }];
    });
  }
  function quantity(index: number, delta: number) {
    setSelections((current) =>
      current.flatMap((line, i) =>
        i !== index
          ? [line]
          : line.quantity + delta < 1
            ? []
            : [{ ...line, quantity: Math.min(20, line.quantity + delta) }],
      ),
    );
  }
  function packageQuantity(id: string, delta: number) {
    trackStart();
    setPackages((current) => {
      const existing = current.find((line) => line.id === id);
      if (!existing)
        return delta > 0 ? [...current, { id, quantity: 1 }] : current;
      return current.flatMap((line) =>
        line.id !== id
          ? [line]
          : line.quantity + delta < 1
            ? []
            : [{ ...line, quantity: Math.min(10, line.quantity + delta) }],
      );
    });
  }
  function changeStep(next: "services" | "contact") {
    trackStart();
    if (next === "contact" && !selections.length && !packages.length) {
      setError(
        "Choose a service or package, or send a general consultation inquiry instead.",
      );
      return;
    }
    setStep(next);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }
  return (
    <div>
      <div className="mb-9 max-w-2xl sm:mb-12">
        <p className="eyebrow">
          {step === "services"
            ? "01 · Your service wish list"
            : "02 · Start a conversation"}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-display text-5xl leading-[1.08] tracking-[-.035em] outline-none sm:text-6xl"
        >
          {step === "services" ? (
            <>
              Good hair.
              <br />
              <span className="text-secondary italic">A personal plan.</span>
            </>
          ) : (
            <>
              Tell us about
              <br />
              <span className="text-secondary italic">your next chapter.</span>
            </>
          )}
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          {step === "services"
            ? "Explore services for yourself or a group. Build a starting estimate, then share your interest with Elisabeth. Appointments are not open yet."
            : "This is an interest inquiry, not an appointment request or reservation. Elisabeth can answer your questions about the plan."}
        </p>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] lg:gap-8">
        <div className="min-w-0">
          <div hidden={step !== "services"} className="space-y-6">
            <Card className="border py-6 shadow-none ring-0">
              <CardContent className="px-5 sm:px-7">
                <h2 className="mb-5 font-display text-3xl">
                  Where does your story start?
                </h2>
                <VisitChoice
                  value={visitType}
                  onChange={(value) => {
                    trackStart();
                    setVisitType(value);
                  }}
                />
                <p className="mt-4 rounded-lg bg-muted p-4 text-xs leading-6 text-muted-foreground">
                  {availability[visitType].message}
                </p>
                <div className="mt-5 space-y-2">
                  <Label htmlFor="plan-area">
                    City or neighborhood · optional
                  </Label>
                  <Input
                    id="plan-area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    maxLength={120}
                    placeholder="e.g. Suncrest, Draper"
                    className="h-12"
                  />
                  <p className="text-xs leading-6 text-muted-foreground">
                    No street address needed. A location is not a confirmed
                    service area or travel quote.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border py-6 shadow-none ring-0">
              <CardContent className="px-5 sm:px-7">
                <p className="eyebrow">Your people, your plan</p>
                <h2 className="mt-3 font-display text-3xl">
                  Make room for everyone.
                </h2>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Choose a person, then add their services below. Generic labels
                  are enough—please don’t enter children’s full names.
                </p>
                <div
                  className="mt-5 flex flex-wrap gap-2"
                  aria-label="Select a family member"
                >
                  {members.map((member) => (
                    <Button
                      key={member}
                      type="button"
                      variant={activeMember === member ? "default" : "outline"}
                      onClick={() => setActiveMember(member)}
                      aria-pressed={activeMember === member}
                      className="h-10 px-3 text-xs"
                    >
                      {member}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={members.length >= 12}
                    className="h-10 px-3 text-xs"
                    onClick={() => {
                      const member = `Person ${members.length + 1}`;
                      setMembers((current) => [...current, member]);
                      setActiveMember(member);
                    }}
                  >
                    <UserPlus className="size-4" aria-hidden="true" /> Add
                    person
                  </Button>
                </div>
                <p className="mt-6 text-xs font-semibold text-secondary">
                  Add a service for {activeMember}
                </p>
                <Accordion
                  defaultValue={[
                    services.find((s) => s.id === initialService)?.category ??
                      "Haircuts",
                  ]}
                  className="mt-2"
                >
                  {serviceCategories.map((category) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="py-5 text-sm font-semibold">
                        {category}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {services
                            .filter((service) => service.category === category)
                            .map((service) => (
                              <div
                                key={service.id}
                                className="flex min-w-0 items-center justify-between gap-3 border-b border-border/60 py-4 last:border-0"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-medium leading-5">
                                    {service.name}
                                  </p>
                                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                                    {service.description}
                                  </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <span className="text-xs text-primary">
                                    {servicePrice(service)}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="size-9"
                                    disabled={
                                      selections.length >= 60 &&
                                      !selections.some(
                                        (line) =>
                                          line.id === service.id &&
                                          line.member === activeMember,
                                      )
                                    }
                                    aria-label={`Add ${service.name} for ${activeMember}`}
                                    onClick={() => addService(service.id)}
                                  >
                                    <Plus
                                      className="size-3.5"
                                      aria-hidden="true"
                                    />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <p className="mt-4 text-xs leading-6 text-muted-foreground">
                  Prices marked + are starting prices. Extension hair is
                  separate. Per-row services use row quantities, not a
                  per-person price.
                </p>
              </CardContent>
            </Card>
            {!!selections.length && (
              <Card className="border py-6 shadow-none ring-0">
                <CardContent className="px-5 sm:px-7">
                  <h2 className="font-display text-2xl">
                    Individual & additional services
                  </h2>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground">
                    Package inclusions are already priced in the package. Add
                    services here only for additional people or work.
                  </p>
                  <ul className="mt-4 divide-y divide-border">
                    {selections.map((line, index) => {
                      const service = services.find((s) => s.id === line.id)!;
                      return (
                        <li key={`${line.id}:${line.member}`} className="py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <span className="text-[10px] font-semibold text-secondary">
                                {line.member}
                              </span>
                              <p className="mt-1 text-xs font-medium leading-5">
                                {service.name}
                              </p>
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                {service.unit === "row"
                                  ? "Number of rows"
                                  : "Number of services"}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center rounded-lg border">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-none"
                                onClick={() => quantity(index, -1)}
                                aria-label={`Remove one ${service.name} for ${line.member}`}
                              >
                                <Minus className="size-3" aria-hidden="true" />
                              </Button>
                              <output
                                className="min-w-6 text-center text-xs tabular-nums"
                                aria-label={`${service.name} quantity`}
                                aria-live="polite"
                              >
                                {line.quantity}
                              </output>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-none"
                                onClick={() => quantity(index, 1)}
                                disabled={line.quantity >= 20}
                                aria-label={`Add one ${service.name} for ${line.member}`}
                              >
                                <Plus className="size-3" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="mt-3 inline-flex items-center gap-1 text-[10px] text-muted-foreground underline underline-offset-4"
                            onClick={() =>
                              setSelections((current) =>
                                current.filter((_, i) => i !== index),
                              )
                            }
                          >
                            <Trash2 className="size-3" aria-hidden="true" />
                            Remove service
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
            <Card className="border py-6 shadow-none ring-0">
              <CardContent className="px-5 sm:px-7">
                <p className="eyebrow">All together</p>
                <h2 className="mt-3 font-display text-3xl">Family packages.</h2>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Each package includes the listed people and cuts. Travel is
                  separate, once per household appointment.
                </p>
                <div className="mt-4 divide-y divide-border">
                  {familyPackages.map((pack) => {
                    const quantity =
                      packages.find((item) => item.id === pack.id)?.quantity ??
                      0;
                    return (
                      <div key={pack.id} className="py-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-display text-xl">
                              {pack.name}{" "}
                              <span className="ml-1 text-primary">
                                {formatMoney(pack.priceCents)}
                              </span>
                            </h3>
                            <p className="mt-2 text-xs leading-6 text-muted-foreground">
                              {pack.inclusions}
                            </p>
                            {pack.needsConfirmation && (
                              <p className="mt-2 text-[11px] leading-5 text-secondary">
                                The included women’s haircut type needs
                                confirmation. We’ll discuss it before making a
                                plan.
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center rounded-lg border">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 rounded-none"
                              disabled={!quantity}
                              aria-label={`Remove one ${pack.name} package`}
                              onClick={() => packageQuantity(pack.id, -1)}
                            >
                              <Minus className="size-3" aria-hidden="true" />
                            </Button>
                            <output
                              className="min-w-6 text-center text-xs"
                              aria-live="polite"
                              aria-label={`${pack.name} quantity`}
                            >
                              {quantity}
                            </output>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 rounded-none"
                              disabled={quantity >= 10}
                              aria-label={`Add one ${pack.name} package`}
                              onClick={() => packageQuantity(pack.id, 1)}
                            >
                              <Plus className="size-3" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link
                  href="/contact?topic=neighborhood"
                  className="mt-2 inline-block text-xs text-primary underline underline-offset-4"
                >
                  Thinking about a neighborhood haircut day? Let’s talk.
                </Link>
              </CardContent>
            </Card>
            <Card className="border py-6 shadow-none ring-0">
              <CardContent className="px-5 sm:px-7">
                <p className="eyebrow">For a future house call</p>
                <h2 className="mt-3 font-display text-2xl">
                  One household. One travel fee.
                </h2>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  These are planned convenience-fee bands, not an address
                  lookup. Exact routes, the starting point, and travel details
                  still need confirmation.
                </p>
                <dl className="mt-4 divide-y divide-border">
                  {travelBands.map((band) => (
                    <div
                      key={band.label}
                      className="flex justify-between gap-4 py-3 text-xs"
                    >
                      <dt>
                        {band.label}
                        <span className="mt-1 block text-[10px] text-muted-foreground">
                          {band.areaExample}
                        </span>
                      </dt>
                      <dd className="shrink-0 text-primary">
                        {band.feeCents === null
                          ? "Custom quote"
                          : formatMoney(band.feeCents)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <details className="mt-4 rounded-lg bg-muted p-4">
                  <summary className="cursor-pointer text-xs font-medium">
                    Try a planning example
                  </summary>
                  <Label htmlFor="travel-minutes" className="mt-4 text-xs">
                    Estimated drive time: {minutes} minutes
                  </Label>
                  <input
                    id="travel-minutes"
                    type="range"
                    min={0}
                    max={90}
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="mt-4 w-full accent-primary"
                  />
                  <p className="mt-2 text-xs text-primary">
                    Example household fee:{" "}
                    {travelFeeForMinutes(minutes) === null
                      ? "custom quote"
                      : formatMoney(travelFeeForMinutes(minutes)!)}
                  </p>
                  <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
                    Illustration only. This does not calculate an address or add
                    a verified fee to your inquiry.
                  </p>
                </details>
              </CardContent>
            </Card>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 p-4 text-sm leading-6 text-destructive"
              >
                {error}{" "}
                <Link href="/contact" className="underline">
                  Ask a general question
                </Link>
                .
              </p>
            )}
          </div>
          <div hidden={step !== "contact"}>
            <ContactForm
              context={context}
              onBack={() => changeStep("services")}
            />
          </div>
        </div>
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <QuoteSummary
            context={context}
            showContinue={step === "services"}
            onContinue={() => changeStep("contact")}
          />
          {step === "services" && (
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/services" />}
              className="mt-4 h-11 w-full text-muted-foreground"
            >
              <ArrowLeft aria-hidden="true" /> Back to the full menu
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}
