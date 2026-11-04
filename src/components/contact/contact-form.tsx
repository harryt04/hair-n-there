"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { availability } from "@/data/availability";
import { useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  House,
  LoaderCircle,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { business, smsConsentText } from "@/data/business";
import { contactSchema } from "@/lib/validation";
import {
  type ServiceSelection,
  type PackageSelection,
  type VisitType,
} from "@/lib/quote-types";
import { trackEvent } from "@/components/site/telemetry";

export type InquiryContext = {
  visitType: VisitType;
  area: string;
  services: ServiceSelection[];
  packages: PackageSelection[];
  intent: "interest" | "consultation";
};
type FieldErrors = Record<string, string>;

export function VisitChoice({
  value,
  onChange,
}: {
  value: VisitType;
  onChange: (value: VisitType) => void;
}) {
  return (
    <RadioGroup
      aria-label="Setting you are interested in"
      value={value}
      onValueChange={(next) => onChange(next as VisitType)}
      className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1.5"
    >
      {(
        [
          { value: "house", label: "House call", Icon: House },
          { value: "salon", label: "Salon", Icon: Sparkles },
          { value: "event", label: "Events", Icon: PartyPopper },
        ] as const
      ).map(({ value: option, label, Icon }) => (
        <Label
          key={option}
          className={`relative min-h-12 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-3 py-3 text-xs transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background sm:text-sm ${value === option ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <RadioGroupItem value={option} className="sr-only" />
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {label}
          <span className="text-[9px] font-normal text-muted-foreground">
            {availability[option].status}
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}

export function ContactEntry() {
  const search = useSearchParams();
  const topic =
    search.get("topic") === "neighborhood" ? "neighborhood" : "general";
  const requestedVisit = search.get("visit");
  const visit: VisitType =
    requestedVisit === "salon" || requestedVisit === "event"
      ? requestedVisit
      : "house";
  return (
    <ContactForm
      key={`${topic}:${visit}`}
      initialTopic={topic}
      initialVisit={visit}
    />
  );
}

export function ContactForm({
  context,
  onBack,
  initialTopic = "general",
  initialVisit = "house",
}: {
  context?: InquiryContext;
  onBack?: () => void;
  initialTopic?: "general" | "neighborhood";
  initialVisit?: VisitType;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState<"consultation" | "interest">(
    "consultation",
  );
  const [topic, setTopic] = useState<"general" | "neighborhood">(initialTopic);
  const [households, setHouseholds] = useState(2);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [visitType, setVisitType] = useState<VisitType>(initialVisit);
  const [area, setArea] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const sending = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  function focusError() {
    requestAnimationFrame(() => errorRef.current?.focus());
  }
  function fieldProps(field: string) {
    return {
      "aria-invalid": !!errors[field],
      "aria-describedby": errors[field] ? `${field}-error` : undefined,
    };
  }
  function fieldError(field: string) {
    return errors[field] ? (
      <p
        id={`${field}-error`}
        className="text-xs leading-relaxed text-destructive"
      >
        {errors[field]}
      </p>
    ) : null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || success) return;
    setError("");
    setErrors({});
    const selected = context ?? {
      visitType,
      area,
      services: [],
      packages: [],
      intent: topic === "neighborhood" ? "interest" : intent,
    };
    const result = contactSchema.safeParse({
      name,
      email,
      phone,
      topic,
      ...(topic === "neighborhood"
        ? { neighborhoodHouseholds: households }
        : {}),
      message,
      smsConsent,
      website,
      ...selected,
    });
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? "form");
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setError("Please check the details highlighted below.");
      focusError();
      return;
    }
    sending.current = true;
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success !== true) {
        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          const nextErrors: FieldErrors = {};
          for (const [key, value] of Object.entries(data.fieldErrors)) {
            if (typeof value === "string") nextErrors[key] = value;
            else if (Array.isArray(value) && typeof value[0] === "string")
              nextErrors[key] = value[0];
          }
          setErrors(nextErrors);
        }
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Your inquiry couldn’t be delivered. Please try again; your details are still here.",
        );
        focusError();
        return;
      }
      setSuccess(
        typeof data.message === "string"
          ? data.message
          : "Your inquiry has been received. Elisabeth can follow up about the details.",
      );
      trackEvent("inquiry_submitted");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setError(
        "We couldn’t confirm delivery. Please try again; your details are still here. If you retry after a timeout, the first inquiry may already have arrived.",
      );
      focusError();
    } finally {
      sending.current = false;
      setSubmitting(false);
    }
  }

  if (success)
    return (
      <Card className="border border-border py-8 shadow-none ring-0 sm:py-10">
        <CardContent>
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            className="outline-none"
          >
            <span className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-muted text-primary">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-3xl sm:text-4xl">
              You’re on your way
              <br />
              to a good hair day.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              {success}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              This is an informational inquiry. No appointment has been
              requested, reserved, or accepted.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/" />}
              className="mt-8 h-12 px-6"
            >
              Back to HairnThere <ArrowUpRight aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card className="border border-border py-6 shadow-none ring-0 sm:py-8">
      <CardContent className="px-5 sm:px-8">
        <form
          onSubmit={submit}
          noValidate
          aria-label="Consultation or interest inquiry"
          aria-busy={submitting}
        >
          <h2 className="font-display text-2xl sm:text-3xl">Your details</h2>
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            hidden={!error}
            className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive outline-none"
          >
            {error}
            {!business.supportEmail && business.instagramUrl && (
              <span className="mt-2 block">
                You can also{" "}
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  message Elisabeth on Instagram
                </a>
                .
              </span>
            )}
            {business.supportEmail && (
              <span className="mt-2 block">
                You can also{" "}
                <a
                  href={`mailto:${business.supportEmail}`}
                  className="underline underline-offset-4"
                >
                  email Elisabeth
                </a>
                .
              </span>
            )}
          </div>
          <fieldset disabled={submitting} className="min-w-0">
            {!context && (
              <div className="mt-6">
                <VisitChoice value={visitType} onChange={setVisitType} />
              </div>
            )}
            <p className="mt-4 rounded-lg bg-muted p-4 text-xs leading-6 text-muted-foreground">
              {availability[context?.visitType ?? visitType].message}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inquiry-purpose">
                  What would you like to discuss?
                </Label>
                <select
                  id="inquiry-purpose"
                  className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value as "general" | "neighborhood")
                  }
                >
                  <option value="general">A service or consultation</option>
                  <option value="neighborhood">Neighborhood haircut day</option>
                </select>
              </div>
              {topic === "neighborhood" ? (
                <div className="space-y-2">
                  <Label htmlFor="households">
                    Interested households · estimate
                  </Label>
                  <Input
                    id="households"
                    type="number"
                    min={1}
                    max={100}
                    value={households}
                    onChange={(e) => setHouseholds(Number(e.target.value))}
                    className="h-12"
                    {...fieldProps("neighborhoodHouseholds")}
                  />
                  {fieldError("neighborhoodHouseholds")}
                </div>
              ) : !context ? (
                <div className="space-y-2">
                  <Label htmlFor="inquiry-intent">Inquiry type</Label>
                  <select
                    id="inquiry-intent"
                    className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={intent}
                    onChange={(e) =>
                      setIntent(e.target.value as "interest" | "consultation")
                    }
                  >
                    <option value="consultation">Ask for a consultation</option>
                    <option value="interest">
                      Share interest / ask about availability
                    </option>
                  </select>
                </div>
              ) : null}
            </div>
            {topic === "neighborhood" && (
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Tell us the neighborhood and your idea below. Reduced travel
                fees are arranged individually; no group appointment or discount
                is confirmed here.
              </p>
            )}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Your name <span className="sr-only">(required)</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First and last name"
                  className="h-12"
                  {...fieldProps("name")}
                />
                {fieldError("name")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email address <span className="sr-only">(required)</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12"
                  {...fieldProps("email")}
                />
                {fieldError("email")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone number{" "}
                  <span className="font-normal text-muted-foreground">
                    {smsConsent ? "· for texts" : "· optional"}
                  </span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required={smsConsent}
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="h-12"
                  {...fieldProps("phone")}
                />
                {fieldError("phone")}
              </div>
            </div>
            {!context && visitType === "house" && (
              <div className="mt-5 space-y-2">
                <Label htmlFor="contact-area">
                  City or neighborhood{" "}
                  <span className="font-normal text-muted-foreground">
                    · optional
                  </span>
                </Label>
                <Input
                  id="contact-area"
                  name="area"
                  value={area}
                  maxLength={120}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Suncrest"
                  className="h-12"
                  {...fieldProps("area")}
                />
                {fieldError("area")}
                <p className="text-xs leading-6 text-muted-foreground">
                  No street address needed yet.
                </p>
              </div>
            )}
            <div className="mt-5 space-y-2">
              <Label htmlFor="message">
                What do you have in mind?{" "}
                <span className="font-normal text-muted-foreground">
                  · optional
                </span>
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                maxLength={1500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A fresh cut, a color idea, or a family haircut day…"
                className="min-h-32 resize-y p-3"
                {...fieldProps("message")}
              />
              {fieldError("message")}
            </div>
            <div
              className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="mt-6 flex items-start gap-3">
              <Checkbox
                id="smsConsent"
                name="smsConsent"
                checked={smsConsent}
                onCheckedChange={(checked) => setSmsConsent(checked === true)}
                className="mt-1 shrink-0"
                {...fieldProps("smsConsent")}
              />
              <div>
                <Label
                  htmlFor="smsConsent"
                  className="block cursor-pointer text-xs font-normal leading-6 text-muted-foreground"
                >
                  {smsConsentText}
                </Label>
                <p className="text-xs leading-6 text-muted-foreground">
                  See our{" "}
                  <Link href="/terms" className="underline underline-offset-4">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                {fieldError("smsConsent")}
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="mt-7 h-12 w-full px-6"
            >
              {submitting ? (
                <>
                  <LoaderCircle
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />{" "}
                  Sending your inquiry…
                </>
              ) : (
                <>
                  Send my inquiry <ArrowUpRight aria-hidden="true" />
                </>
              )}
            </Button>
          </fieldset>
          <p className="mt-3 text-center text-xs leading-6 text-muted-foreground">
            A conversation only. No appointment, payment, or ongoing
            mailing-list subscription.
          </p>
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              disabled={submitting}
              onClick={onBack}
              className="mt-4 h-11 w-full"
            >
              <ArrowLeft aria-hidden="true" /> Back to your services
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
