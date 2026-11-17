// Server-only helpers shared by /api/contact and /api/availability: request
// guards, the booking on/off switch (including the development demo), busy
// time, and hold creation. Do not import from client components.

import { business } from "@/data/business";
import { schedule } from "@/data/schedule";
import {
  bookingConfig,
  createTentativeHold,
  getBusyIntervals,
} from "@/lib/google-calendar";
import { addDays, localDateOf, zonedWallTimeToUtc } from "@/lib/schedule";
import type {
  BusyInterval,
  TentativeHold,
  TentativeHoldInput,
} from "@/lib/schedule-types";

// ---------------------------------------------------------------------------
// Request guards

export function allowedOrigins(request: Request) {
  return new Set([
    new URL(business.url).origin,
    "https://www.hairnthere.com",
    new URL(request.url).origin,
  ]);
}

/** True when the request comes from another site. */
export function isCrossSite(request: Request) {
  const origin = request.headers.get("origin");
  return (
    (origin !== null &&
      origin !== "" &&
      !allowedOrigins(request).has(origin)) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  );
}

export function isJsonRequest(request: Request) {
  return (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ===
    "application/json"
  );
}

export class BodyError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export type BodyMessages = {
  tooLarge: string;
  missing: string;
  invalid: string;
};

export async function readBoundedJson(
  request: Request,
  maxBytes: number,
  messages: BodyMessages,
) {
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > maxBytes))
    throw new BodyError(messages.tooLarge, 413);
  if (!request.body) throw new BodyError(messages.missing, 400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new BodyError("The request took too long. Please try again.", 408),
        ),
      5000,
    );
  });
  try {
    while (true) {
      const { value, done } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) throw new BodyError(messages.tooLarge, 413);
      chunks.push(value);
    }
    const buffer = new Uint8Array(bytes);
    let position = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, position);
      position += chunk.byteLength;
    }
    try {
      return JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(buffer),
      );
    } catch {
      throw new BodyError(messages.invalid, 400);
    }
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => undefined);
  }
}

// ---------------------------------------------------------------------------
// Booking switch and calendar access

/**
 * Development-only demo so the stage-2 picker can be tried before Google is
 * wired: `BOOKING_DEMO=true pnpm dev`. `next build` inlines NODE_ENV as
 * "production", so this is constant-false (and the demo code is unreachable)
 * in every production build. The demo never calls Google.
 */
export function bookingDemoActive(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.BOOKING_DEMO === "true"
  );
}

/** Whether customers may request tentative holds in this environment. */
export function bookingEnabled(): boolean {
  return bookingDemoActive() || bookingConfig().enabled;
}

/** Busy time for the hold window. Throws CalendarUnavailableError (fail closed). */
export async function loadBusyIntervals(
  timeMin: Date,
  timeMax: Date,
): Promise<BusyInterval[]> {
  if (bookingDemoActive()) return demoBusyIntervals(timeMin, timeMax);
  return getBusyIntervals(timeMin, timeMax);
}

/** Writes the tentative hold (or, in the demo, records it in memory). */
export async function placeTentativeHold(
  input: TentativeHoldInput,
): Promise<TentativeHold> {
  if (bookingDemoActive()) {
    demoHolds.push({ start: input.start, end: input.end });
    if (demoHolds.length > 200) demoHolds.shift();
    return { eventId: `demo-${input.start.getTime()}` };
  }
  return createTentativeHold(input);
}

// Deterministic synthetic calendar: a few blocks on most days, varying by date,
// plus any demo holds requested since the dev server started (so a repeated
// request for the same time returns 409 like the real calendar would).
const demoHolds: BusyInterval[] = [];
const demoPatterns: [string, string][][] = [
  [
    ["10:00", "11:30"],
    ["15:00", "16:00"],
  ],
  [
    ["09:00", "10:00"],
    ["12:30", "14:00"],
    ["18:00", "19:30"],
  ],
  [],
  [["11:00", "13:00"]],
  [
    ["09:30", "10:30"],
    ["16:30", "18:00"],
  ],
  [
    ["13:00", "15:00"],
    ["19:00", "20:00"],
  ],
  [["09:00", "12:00"]],
];

function demoBusyIntervals(timeMin: Date, timeMax: Date): BusyInterval[] {
  const busy: BusyInterval[] = [];
  const last = localDateOf(timeMax, schedule.timeZone);
  for (
    let date = localDateOf(timeMin, schedule.timeZone);
    date <= last;
    date = addDays(date, 1)
  ) {
    const pattern =
      demoPatterns[Number(date.slice(8, 10)) % demoPatterns.length];
    for (const [start, end] of pattern)
      busy.push({
        start: zonedWallTimeToUtc(date, start, schedule.timeZone),
        end: zonedWallTimeToUtc(date, end, schedule.timeZone),
      });
  }
  busy.push(...demoHolds);
  return busy
    .filter((block) => block.end > timeMin && block.start < timeMax)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

// ---------------------------------------------------------------------------
// Customer-facing time formatting (business time zone)

const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: schedule.timeZone,
  weekday: "long",
  month: "long",
  day: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: schedule.timeZone,
  hour: "numeric",
  minute: "2-digit",
});
// Newer ICU versions put a narrow no-break space before AM/PM.
const time = (instant: Date) =>
  timeFormat.format(instant).replace(/[  ]/g, " ");

/** "Thursday, November 20, 9:00 AM" in Mountain Time. */
export function formatSlotStart(start: Date) {
  return `${dateFormat.format(start)}, ${time(start)}`;
}

/** "Thursday, November 20, 9:00 AM – 10:30 AM (Mountain Time)". */
export function formatSlotRange(start: Date, end: Date) {
  return `${formatSlotStart(start)} – ${time(end)} (Mountain Time)`;
}
