import { availability } from "@/data/availability";
import { familyPackages } from "@/data/packages";
import { schedule } from "@/data/schedule";
import { services } from "@/data/services";
import { contactSchema, type ContactInput } from "@/lib/validation";
import {
  acquireLock,
  checkContactRateLimit,
  checkHoldDailyLimit,
  checkHoldEmailLimit,
  type HeldLock,
  RateLimitUnavailableError,
} from "@/lib/rate-limit";
import {
  contactWebhookUrl,
  InquiryConfigurationError,
  sendContactInquiry,
} from "@/lib/discord";
import {
  allowedOrigins,
  BodyError,
  bookingEnabled,
  formatSlotStart,
  isCrossSite,
  isJsonRequest,
  loadBusyIntervals,
  placeTentativeHold,
  readBoundedJson,
} from "@/lib/booking";
import { CalendarConfigurationError } from "@/lib/google-calendar";
import {
  addDays,
  estimateAppointment,
  isSlotOpen,
  localDateOf,
  zonedWallTimeToUtc,
} from "@/lib/schedule";

const MAX_BODY_BYTES = 16_384;

const failure = (
  error: string,
  status: number,
  headers?: Record<string, string>,
) =>
  Response.json(
    { success: false, error },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );

const bookingFailure = (
  code: "booking_unavailable" | "slot_unavailable",
  error: string,
  status: number,
) =>
  Response.json(
    { success: false, code, error },
    { status, headers: { "Cache-Control": "no-store" } },
  );

const BOOKING_OFF =
  "Online time requests aren’t available right now. Please describe your timing instead.";
const SLOT_TAKEN =
  "That time was just requested by someone else. Please choose another time.";
const SLOT_GONE =
  "That time is no longer available. Please choose another time.";
const DAY_BUSY =
  "Someone is requesting a time on this day right now. Please try again in a moment.";
const HOLD_LIMIT =
  "You’ve already requested a time recently, and Elisabeth will be in touch. To ask about another time, please describe your timing instead.";
const DAILY_LIMIT =
  "Online time requests are paused for today. Please describe your timing instead and Elisabeth will follow up.";
const NOT_PLACED =
  "We couldn’t place your time request just now. Please try again in a moment, or describe your timing instead.";
const unschedulable = {
  nothing_selected:
    "Please add at least one person or service before choosing a time.",
  consultation_required:
    "This selection needs a consultation first. Please describe your timing instead.",
  too_long:
    "This visit is longer than online times allow. Please describe your timing instead.",
} as const;

const minute = 60_000;
const LOCK_TTL_SECONDS = 60;
const LOCK_WAIT_MS = 4000;

type SourcePath = "/" | "/contact" | "/quote" | "/api/contact";

const LINK_PATTERN = /\b(?:[a-z][a-z0-9+.-]*:\/\/|www\.)\S+/gi;
/** Plain single-line text for invitation fields: no links or control characters. */
const inviteText = (value: string, max: number) =>
  value
    .replace(LINK_PATTERN, "")
    .replace(/[\p{Cc}\p{Cf}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
/** Names keep letters, marks, spaces, apostrophes, periods, and hyphens only. */
const personName = (value: string) =>
  inviteText(value, 100)
    .replace(/[^\p{L}\p{M} '.-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

/**
 * Request a tentative hold for a validated house-call submission with slotStart.
 *
 * Concurrency: holds are serialized per local date (not just per start time,
 * because different starts can overlap) with a 60 s lock. With Upstash Redis
 * the lock is shared by every replica, and a Redis error fails closed. Without
 * Redis the lock is process-local, so two replicas could each pass the
 * free/busy check for overlapping times and both write holds. That residual
 * race is accepted for a single-container deployment; configure Redis before
 * running multiple replicas. Elisabeth still reviews every tentative hold.
 */
async function requestHold(input: ContactInput, sourcePath: SourcePath) {
  if (!availability[input.visitType].holdsTentativeTimes || !bookingEnabled())
    return bookingFailure("booking_unavailable", BOOKING_OFF, 403);

  // Recompute duration from the submitted selection; browser estimates are untrusted.
  const estimate = estimateAppointment({
    haircutCount: input.haircutCount,
    colorCount: input.colorCount,
    services: input.services.map(({ id, quantity }) => ({ id, quantity })),
    packages: input.packages.map(({ id, quantity }) => ({ id, quantity })),
  });
  if (!estimate.schedulable)
    return Response.json(
      {
        success: false,
        error: unschedulable[estimate.reason],
        fieldErrors: { slotStart: [unschedulable[estimate.reason]] },
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );

  const start = new Date(input.slotStart!);
  const end = new Date(start.getTime() + estimate.minutes * minute);
  const now = new Date();
  // Cheap pre-check (hours, notice, horizon) before touching the lock or calendar.
  if (!isSlotOpen(start, { now, durationMinutes: estimate.minutes, busy: [] }))
    return bookingFailure("slot_unavailable", SLOT_GONE, 409);

  const date = localDateOf(start, schedule.timeZone);
  let lock: HeldLock | null = null;
  try {
    lock = await acquireLock(`booking-day:${date}`, LOCK_TTL_SECONDS);
    // Another request is writing a hold for this day: wait briefly for it to finish.
    for (let waited = 0; !lock && waited < LOCK_WAIT_MS; waited += 250) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      lock = await acquireLock(`booking-day:${date}`, LOCK_TTL_SECONDS);
    }
  } catch (error) {
    // Redis is configured but failing: fail closed rather than risk double holds.
    if (error instanceof RateLimitUnavailableError)
      return bookingFailure("booking_unavailable", NOT_PLACED, 503);
    throw error;
  }
  if (!lock) return bookingFailure("slot_unavailable", DAY_BUSY, 409);

  try {
    const buffer = schedule.travelBufferMinutes * minute;
    const busy = await loadBusyIntervals(
      new Date(
        zonedWallTimeToUtc(date, "00:00", schedule.timeZone).getTime() - buffer,
      ),
      new Date(
        zonedWallTimeToUtc(
          addDays(date, 1),
          "00:00",
          schedule.timeZone,
        ).getTime() + buffer,
      ),
    );
    if (
      !isSlotOpen(start, {
        now: new Date(),
        durationMinutes: estimate.minutes,
        busy,
      })
    )
      return bookingFailure("slot_unavailable", SLOT_TAKEN, 409);

    // Caps on invitations sent from Elisabeth's account (spam/flooding guard),
    // counted only once a hold is about to be written.
    const today = localDateOf(new Date(), schedule.timeZone);
    if (!(await checkHoldDailyLimit(today)).allowed)
      return bookingFailure("booking_unavailable", DAILY_LIMIT, 429);
    if (!(await checkHoldEmailLimit(input.email!)).allowed)
      return bookingFailure("booking_unavailable", HOLD_LIMIT, 429);

    const firstName = personName(input.name).split(" ")[0] || "website request";
    const serviceNames = new Map(
      services.map((service) => [service.id, service.name]),
    );
    const packageNames = new Map(
      familyPackages.map((pack) => [pack.id, pack.name]),
    );
    const selections = [
      ...input.services.map(
        (line) =>
          `- ${line.member ? `${inviteText(line.member, 40)}: ` : ""}${serviceNames.get(line.id) ?? line.id} × ${line.quantity}`,
      ),
      ...input.packages.map(
        (line) =>
          `- ${packageNames.get(line.id) ?? line.id} × ${line.quantity}`,
      ),
    ];
    // The attendee (whoever's email was submitted) receives this content from
    // Elisabeth's account, so it carries no prices and no free-form visitor
    // text: the message goes to Discord only, and names/addresses are reduced
    // to plain text without links.
    const description = [
      "Tentative time request from hairnthere.com. Elisabeth will confirm this time or suggest another; your personal quote will follow.",
      "",
      `People wanting haircuts: ${input.haircutCount ?? 0}`,
      `People wanting color: ${input.colorCount ?? 0}`,
      ...(selections.length ? ["Services:", ...selections] : []),
      `Estimated duration: ${estimate.minutes} minutes (includes setup)`,
      "",
      `Address: ${inviteText(input.address || "", 400) || "Not supplied"}`,
      `Name: ${personName(input.name)}`,
      `Email: ${input.email}`,
      ...(input.phone ? [`Phone: ${input.phone}`] : []),
      ...(input.message
        ? ["", "Your note was sent to Elisabeth separately."]
        : []),
    ].join("\n");

    await placeTentativeHold({
      start,
      end,
      summary: `Requested: house call · ${firstName}`,
      description,
      location: inviteText(input.address || "", 400) || undefined,
      attendeeEmail: input.email!,
      attendeeName: personName(input.name),
    });
  } catch (error) {
    if (error instanceof CalendarConfigurationError)
      // Our own message only (no provider bodies, tokens, or customer data).
      console.error(`Booking calendar configuration: ${error.message}`);
    // Calendar or lock failures before the hold exists. A timed-out insert
    // could rarely still land; Elisabeth would see it as an unconfirmed hold.
    return bookingFailure("booking_unavailable", NOT_PLACED, 503);
  } finally {
    await lock.release();
  }

  // The calendar hold (and Google's invitation email) is the acknowledgement
  // for a time request, so success no longer depends on Discord delivery.
  try {
    await sendContactInquiry(input, sourcePath, { start, end });
  } catch {
    // Unconfigured or failed webhook: the hold already exists. Google does not
    // notify an organizer about events inserted on her own calendar, so leave
    // an operator signal. Never log customer input or webhook details.
    console.error("Tentative hold placed; Discord notification failed.");
  }
  return Response.json(
    {
      success: true,
      message: `Your time request is in. I’ve held ${formatSlotStart(start)} as a tentative appointment and sent a calendar invitation to your email. I’ll confirm the time and your personal quote, or suggest another time if needed.`,
      hold: { start: start.toISOString(), end: end.toISOString() },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (isCrossSite(request))
    return failure(
      "Please submit your inquiry from the HairnThere website.",
      403,
    );
  if (!isJsonRequest(request))
    return failure("Please submit your inquiry as JSON.", 415);
  try {
    const rate = await checkContactRateLimit(request);
    if (!rate.allowed)
      return failure(
        "You have sent several inquiries recently. Please wait a little before trying again.",
        429,
        { "Retry-After": String(rate.retryAfter) },
      );
    const body = await readBoundedJson(request, MAX_BODY_BYTES, {
      tooLarge: "Please keep your inquiry under 16 KB.",
      missing: "Please include your inquiry details.",
      invalid: "Please send a valid inquiry.",
    });
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: "Please check the highlighted details and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (parsed.data.website)
      return failure(
        "We couldn’t accept this inquiry. Please clear autofilled website details and try again.",
        400,
      );
    // Availability is authoritative server configuration, never client input.
    if (
      parsed.data.intent === "appointment_request" &&
      !availability[parsed.data.visitType].acceptsAppointments
    ) {
      return failure(
        "Appointments for this setting aren’t open. Please send a consultation or interest inquiry instead.",
        403,
      );
    }
    let sourcePath: SourcePath = "/api/contact";
    try {
      const referrer = new URL(request.headers.get("referer") || "");
      if (
        allowedOrigins(request).has(referrer.origin) &&
        (referrer.pathname === "/" ||
          referrer.pathname === "/contact" ||
          referrer.pathname === "/quote")
      )
        sourcePath = referrer.pathname;
    } catch {
      /* Missing or invalid referrer: record the known receiving endpoint. */
    }
    if (parsed.data.slotStart)
      return await requestHold(parsed.data, sourcePath);
    contactWebhookUrl();
    await sendContactInquiry(parsed.data, sourcePath);
    return Response.json(
      {
        success: true,
        message:
          "Your inquiry is with HairnThere. I’ll be in touch to talk through your plans. Your date, time, and quote will be confirmed together.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof BodyError) return failure(error.message, error.status);
    if (error instanceof InquiryConfigurationError)
      return failure(
        "Online inquiries aren’t available right now. Please try again later or use the contact details on this website.",
        503,
      );
    // Never log customer input, webhook URLs, provider response bodies, or credentials.
    return failure(
      "We couldn’t confirm delivery of your inquiry. Please try again later; your visit has not been confirmed.",
      503,
    );
  }
}
