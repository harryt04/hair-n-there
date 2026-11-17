import { z } from "zod";
import { familyPackages } from "@/data/packages";
import { schedule } from "@/data/schedule";
import { services } from "@/data/services";
import {
  BodyError,
  bookingEnabled,
  isCrossSite,
  isJsonRequest,
  loadBusyIntervals,
  readBoundedJson,
} from "@/lib/booking";
import { CalendarConfigurationError } from "@/lib/google-calendar";
import { checkAvailabilityRateLimit } from "@/lib/rate-limit";
import {
  addDays,
  bookingRange,
  computeOpenSlots,
  estimateAppointment,
  zonedWallTimeToUtc,
} from "@/lib/schedule";
import type { AvailabilityResponse } from "@/lib/schedule-types";

const MAX_BODY_BYTES = 16_384;
const noStore = { "Cache-Control": "no-store" };
const serviceIds = new Set(services.map((service) => service.id));
const packageIds = new Set(familyPackages.map((pack) => pack.id));

const count = z.number().int().min(0).max(50).optional();
// Mirrors the inquiry form's selection shape so the UI can send the same lines.
const availabilitySchema = z
  .object({
    haircutCount: count,
    colorCount: count,
    services: z
      .array(
        z
          .object({
            id: z
              .string()
              .max(64)
              .refine((id) => serviceIds.has(id)),
            quantity: z.number().int().min(1).max(20),
            member: z.string().trim().max(40).optional(),
          })
          .strict(),
      )
      .max(60)
      .default([]),
    packages: z
      .array(
        z
          .object({
            id: z
              .string()
              .max(64)
              .refine((id) => packageIds.has(id)),
            quantity: z.number().int().min(1).max(10),
          })
          .strict(),
      )
      .max(5)
      .default([]),
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  })
  .strict();

const json = (body: AvailabilityResponse) =>
  Response.json(body, { headers: noStore });
const failure = (
  error: string,
  status: number,
  headers?: Record<string, string>,
) => Response.json({ error }, { status, headers: { ...noStore, ...headers } });

export async function POST(request: Request) {
  if (isCrossSite(request))
    return failure("Please use the HairnThere website.", 403);
  if (!isJsonRequest(request))
    return failure("Please send the request as JSON.", 415);
  try {
    const rate = await checkAvailabilityRateLimit(request);
    if (!rate.allowed)
      return failure(
        "Too many availability checks. Please wait a little and try again.",
        429,
        { "Retry-After": String(rate.retryAfter) },
      );
    const body = await readBoundedJson(request, MAX_BODY_BYTES, {
      tooLarge: "Please keep the request under 16 KB.",
      missing: "Please include your visit details.",
      invalid: "Please send a valid request.",
    });
    const parsed = availabilitySchema.safeParse(body);
    if (!parsed.success)
      return Response.json(
        {
          error: "Please check your visit details and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400, headers: noStore },
      );

    // Disabled and unconfigured look the same to visitors.
    if (!bookingEnabled()) return json({ enabled: false, reason: "disabled" });
    const { month, ...selection } = parsed.data;
    const estimate = estimateAppointment({
      haircutCount: selection.haircutCount,
      colorCount: selection.colorCount,
      services: selection.services.map(({ id, quantity }) => ({
        id,
        quantity,
      })),
      packages: selection.packages.map(({ id, quantity }) => ({
        id,
        quantity,
      })),
    });
    if (!estimate.schedulable)
      return json({ enabled: false, reason: estimate.reason });

    const now = new Date();
    const range = bookingRange(now);
    const fromDate = `${month}-01`;
    const toDate = addDays(`${addDays(fromDate, 31).slice(0, 7)}-01`, -1);
    const first = fromDate > range.firstDate ? fromDate : range.firstDate;
    const last = toDate < range.lastDate ? toDate : range.lastDate;
    let days: ReturnType<typeof computeOpenSlots> = [];
    if (first <= last) {
      // One free/busy query covering just the requested month inside the range.
      const buffer = schedule.travelBufferMinutes * 60_000;
      const busy = await loadBusyIntervals(
        new Date(
          zonedWallTimeToUtc(first, "00:00", schedule.timeZone).getTime() -
            buffer,
        ),
        new Date(
          zonedWallTimeToUtc(
            addDays(last, 1),
            "00:00",
            schedule.timeZone,
          ).getTime() + buffer,
        ),
      );
      days = computeOpenSlots({
        now,
        durationMinutes: estimate.minutes,
        busy,
        fromDate,
        toDate,
      });
    }
    return json({
      enabled: true,
      timeZone: schedule.timeZone,
      durationMinutes: estimate.minutes,
      firstDate: range.firstDate,
      lastDate: range.lastDate,
      days,
    });
  } catch (error) {
    if (error instanceof BodyError) return failure(error.message, error.status);
    if (error instanceof CalendarConfigurationError)
      // Our own message only (no provider bodies, tokens, or customer data).
      console.error(`Booking calendar configuration: ${error.message}`);
    // CalendarUnavailableError, an unavailable shared rate limiter, or anything
    // unexpected: fail closed so the form falls back to free-text timing.
    return json({ enabled: false, reason: "unavailable" });
  }
}
