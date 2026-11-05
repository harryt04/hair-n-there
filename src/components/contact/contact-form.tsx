"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { availability } from "@/data/availability";
import { business, phoneContactConsentText } from "@/data/business";
import { inquirySchema, type InquiryInput } from "@/lib/inquiry-validation";
import type { VisitType } from "@/lib/quote-types";
import { trackEvent } from "@/components/site/telemetry";

const stages = ["Your people", "Your visit", "Stay in touch"];
const stageFields = [
  ["haircutCount", "colorCount", "message"],
  ["preferredDate", "preferredTime", "exactTime", "address"],
  ["name", "phone", "email"],
];
type FieldErrors = Record<string, string>;

export function ContactEntry() {
  const search = useSearchParams();
  const visit = search.get("visit");
  const visitType = visit === "salon" || visit === "event" ? visit : "house";
  const topic =
    search.get("topic") === "neighborhood" ? "neighborhood" : "general";
  return (
    <ContactForm
      key={`${visitType}:${topic}`}
      visitType={visitType}
      topic={topic}
    />
  );
}

export function ContactForm({
  visitType = "house",
  topic = "general",
}: {
  visitType?: VisitType;
  topic?: "general" | "neighborhood";
}) {
  const prefix = useId();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    haircutCount: "0",
    colorCount: "0",
    preferredDate: "",
    preferredTime: "flexible",
    exactTime: "",
    address: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const sending = useRef(false);
  const inquiryStarted = useRef(false);
  const stageRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const house = visitType === "house";
  const policy = availability[visitType];
  const intent =
    house && policy.acceptsAppointments
      ? "appointment_request"
      : "consultation";

  function startInquiry(event: FormEvent<HTMLFormElement>) {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.name === "website"
    )
      return;
    if (!inquiryStarted.current) {
      inquiryStarted.current = true;
      trackEvent("inquiry_started");
    }
  }
  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }
  function props(field: keyof typeof values) {
    return {
      id: `${prefix}-${field}`,
      name: field,
      value: values[field],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => update(field, e.target.value),
      "aria-invalid": !!errors[field],
      "aria-describedby": errors[field]
        ? `${prefix}-${field}-error`
        : undefined,
    };
  }
  function fieldError(field: string) {
    return errors[field] ? (
      <p
        id={`${prefix}-${field}-error`}
        className="text-sm leading-6 text-destructive"
      >
        {errors[field]}
      </p>
    ) : null;
  }
  function payload() {
    return {
      ...values,
      haircutCount:
        values.haircutCount === "" ? NaN : Number(values.haircutCount),
      colorCount: values.colorCount === "" ? NaN : Number(values.colorCount),
      exactTime: values.preferredTime === "specific" ? values.exactTime : "",
      visitType,
      intent,
      topic,
      services: [],
      packages: [],
      smsConsent: false,
      phoneContactConsent: !!values.phone.trim(),
    };
  }
  function focusStage(next: number) {
    setStep(next);
    requestAnimationFrame(() => stageRef.current?.focus());
  }
  function showErrors(
    nextErrors: FieldErrors,
    message = "Please check the highlighted details.",
  ) {
    setErrors(nextErrors);
    setError(message);
    const firstStage = stageFields.findIndex((fields) =>
      fields.some((field) => nextErrors[field]),
    );
    if (firstStage !== -1) setStep(firstStage);
    requestAnimationFrame(() => errorRef.current?.focus());
  }
  function move(next: number) {
    if (submitting) return;
    if (next > step) {
      const parsed = inquirySchema.safeParse(payload());
      if (!parsed.success) {
        const relevant = stageFields.slice(0, next).flat();
        const found: FieldErrors = {};
        for (const issue of parsed.error.issues) {
          const field = String(issue.path[0]);
          if (relevant.includes(field) && !found[field])
            found[field] = issue.message;
        }
        if (Object.keys(found).length) {
          showErrors(found);
          return;
        }
      }
    }
    setErrors({});
    setError("");
    focusStage(next);
  }
  async function deliver(data: InquiryInput) {
    sending.current = true;
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        const found: FieldErrors = {};
        if (result?.fieldErrors && typeof result.fieldErrors === "object") {
          for (const [key, value] of Object.entries(result.fieldErrors)) {
            if (typeof value === "string") found[key] = value;
            else if (Array.isArray(value) && typeof value[0] === "string")
              found[key] = value[0];
          }
        }
        showErrors(
          found,
          typeof result?.error === "string"
            ? result.error
            : "Your inquiry couldn’t be delivered. Please try again; your details are still here.",
        );
        return;
      }
      setSuccess(
        typeof result.message === "string"
          ? result.message
          : "Elisabeth or a member of her team will be in touch shortly to discuss your plans.",
      );
      trackEvent("inquiry_submitted");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      showErrors(
        {},
        "We couldn’t confirm delivery. Your details are still here. If you retry after a timeout, the first inquiry may already have arrived.",
      );
    } finally {
      sending.current = false;
      setSubmitting(false);
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || success) return;
    if (step < 2) {
      move(step + 1);
      return;
    }
    setErrors({});
    setError("");
    const parsed = inquirySchema.safeParse(payload());
    if (!parsed.success) {
      const found: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "form");
        if (!found[field]) found[field] = issue.message;
      }
      showErrors(found);
      return;
    }
    void deliver(parsed.data);
  }

  if (success)
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-border bg-card p-7 outline-none sm:p-10"
      >
        <Check className="mb-5 size-6 text-primary" aria-hidden="true" />
        <h2 className="font-display text-3xl">One less thing on your list.</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {success}
        </p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Your date, time, and quote will be confirmed together.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block py-3 text-sm text-primary underline underline-offset-4"
        >
          Back to HairnThere
        </Link>
      </div>
    );

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <form
        onChange={startInquiry}
        onSubmit={submit}
        noValidate
        aria-label="House-call or service inquiry"
        aria-busy={submitting}
      >
        <fieldset disabled={submitting} className="min-w-0">
          <legend className="sr-only">Tell Elisabeth about your plans</legend>
          <nav
            aria-label="Inquiry steps"
            className="mb-7 grid grid-cols-3 gap-2"
          >
            {stages.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => move(index)}
                aria-current={step === index ? "step" : undefined}
                className={`min-h-14 border-b-2 px-1 pb-3 text-left text-xs leading-5 sm:text-sm ${step === index ? "border-primary font-medium text-foreground" : "border-border text-muted-foreground"}`}
              >
                <span className="block text-[11px] text-muted-foreground">
                  0{index + 1}
                </span>
                {label}
              </button>
            ))}
          </nav>
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            hidden={!error}
            className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive outline-none"
          >
            {error}
            <a
              href={
                business.supportEmail
                  ? `mailto:${business.supportEmail}`
                  : business.instagramUrl
              }
              className="mt-2 block underline underline-offset-4"
            >
              {business.supportEmail
                ? "You can also email HairnThere."
                : "You can also message HairnThere on Instagram."}
            </a>
          </div>
          <h2
            ref={stageRef}
            tabIndex={-1}
            className="mb-5 font-display text-2xl outline-none sm:text-3xl"
          >
            {stages[step]}
          </h2>
          <div hidden={step !== 0}>
            <p className="mb-5 text-sm leading-7 text-muted-foreground">
              A whole family or just you. How many people would like each
              service?
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${prefix}-haircutCount`}>
                  People wanting haircuts
                </Label>
                <Input
                  {...props("haircutCount")}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={50}
                  step={1}
                  required
                  className="h-12 text-base"
                />
                {fieldError("haircutCount")}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${prefix}-colorCount`}>
                  People wanting color
                </Label>
                <Input
                  {...props("colorCount")}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={50}
                  step={1}
                  required
                  className="h-12 text-base"
                />
                {fieldError("colorCount")}
              </div>
            </div>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Getting both? Include that person in both counts.
            </p>
            <details open={!!errors.message} className="mt-4 text-sm">
              <summary className="cursor-pointer py-3 text-muted-foreground">
                Anything else? · Optional
              </summary>
              <div className="mt-2 space-y-2">
                <Label htmlFor={`${prefix}-message`}>
                  A little more about your plans
                </Label>
                <Textarea
                  {...props("message")}
                  maxLength={1500}
                  rows={3}
                  placeholder="A color idea, styling or extensions, or a neighborhood haircut day…"
                  className="min-h-24 p-3 text-base"
                />
                {fieldError("message")}
              </div>
            </details>
          </div>
          <div hidden={step !== 1}>
            {!house && (
              <p className="mb-5 text-sm leading-7 text-muted-foreground">
                {policy.message}
              </p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${prefix}-preferredDate`}>
                  Preferred date · optional
                </Label>
                <Input
                  {...props("preferredDate")}
                  type="date"
                  className="h-12 text-base"
                />
                {fieldError("preferredDate")}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${prefix}-preferredTime`}>
                  Preferred time
                </Label>
                <select
                  {...props("preferredTime")}
                  className="h-12 w-full rounded-lg border border-input bg-card px-3 text-base"
                >
                  <option value="flexible">Flexible</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="specific">A specific time</option>
                </select>
                {fieldError("preferredTime")}
              </div>
              {values.preferredTime === "specific" && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`${prefix}-exactTime`}>
                    Time you have in mind · Mountain Time
                  </Label>
                  <Input
                    {...props("exactTime")}
                    type="time"
                    required
                    className="h-12 text-base"
                  />
                  {fieldError("exactTime")}
                </div>
              )}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`${prefix}-address`}>
                  {house ? "Visit address" : "City or venue · optional"}
                </Label>
                <Input
                  {...props("address")}
                  autoComplete={house ? "street-address" : "off"}
                  required={house}
                  maxLength={400}
                  placeholder={
                    house
                      ? "Street address, city & ZIP"
                      : "Where do you have in mind?"
                  }
                  className="h-12 text-base"
                />
                {fieldError("address")}
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              No date in mind yet? Leave it blank. Times are local to Utah;
              availability and travel will be discussed together.
            </p>
          </div>
          <div hidden={step !== 2}>
            <p className="mb-5 text-sm leading-7 text-muted-foreground">
              Leave a phone number or email so Elisabeth or her team can discuss
              your visit and a personal quote. If you provide a phone number,
              we’ll use calls or texts for appointment follow-up.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${prefix}-name`}>Your name</Label>
                <Input
                  {...props("name")}
                  autoComplete="name"
                  required
                  maxLength={100}
                  className="h-12 text-base"
                />
                {fieldError("name")}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${prefix}-phone`}>
                  Phone · optional if you provide email
                </Label>
                <Input
                  {...props("phone")}
                  type="tel"
                  autoComplete="tel"
                  required={!values.email.trim()}
                  maxLength={40}
                  aria-describedby={`${prefix}-phone-disclosure${errors.phone ? ` ${prefix}-phone-error` : ""}`}
                  className="h-12 text-base"
                />
                {fieldError("phone")}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`${prefix}-email`}>
                  Email · required if you leave phone blank
                </Label>
                <Input
                  {...props("email")}
                  type="email"
                  autoComplete="email"
                  required={!values.phone.trim()}
                  maxLength={254}
                  className="h-12 text-base"
                />
                {fieldError("email")}
              </div>
            </div>
            <p
              id={`${prefix}-phone-disclosure`}
              className="mt-5 text-xs leading-6 text-muted-foreground"
            >
              {phoneContactConsentText}
            </p>
            <p className="mt-5 text-xs leading-6 text-muted-foreground">
              {house
                ? "Your preferred date and time aren’t reserved until we confirm with you."
                : "This is a consultation inquiry, not an appointment reservation."}
            </p>
          </div>
          <div
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor={`${prefix}-website`}>Leave this field empty</label>
            <input
              {...props("website")}
              autoComplete="off"
              tabIndex={-1}
              maxLength={200}
            />
          </div>
          <div className="mt-7 flex gap-3">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => move(step - 1)}
                className="h-12 px-4"
              >
                <ArrowLeft aria-hidden="true" />
                <span>Back</span>
              </Button>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 flex-1 px-5"
            >
              {submitting ? (
                <>
                  <LoaderCircle
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Sending…
                </>
              ) : step < 2 ? (
                <>
                  Continue <ArrowRight aria-hidden="true" />
                </>
              ) : (
                <>
                  Send my inquiry <ArrowRight aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </fieldset>
        {step === 2 && (
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            By sending, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>
            . See how we handle your details in our{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        )}
      </form>
    </div>
  );
}
