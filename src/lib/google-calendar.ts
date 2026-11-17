// Server-only Google Calendar access for tentative house-call holds. Do not
// import from client components: this module reads OAuth credentials.
// ("server-only" is not installed, and no new dependency is added for it.)
//
// Auth: a long-lived OAuth refresh token for Elisabeth's personal account,
// created once with `pnpm google:auth`. Scopes are the minimal pair:
//   calendar.events.owned   – insert/delete holds on a calendar she owns
//   calendar.events.freebusy – read busy time on calendars she can access
// Errors never carry token values, customer details, or provider bodies.

import type {
  BusyInterval,
  TentativeHold,
  TentativeHoldInput,
} from "@/lib/schedule-types";

export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.owned",
  "https://www.googleapis.com/auth/calendar.events.freebusy",
] as const;

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const TIMEOUT_MS = 5000;
const EXPIRY_MARGIN_MS = 60_000;
const MAX_BUSY_CALENDARS = 10;
const BUSINESS_TIME_ZONE = "America/Denver";

/** Calendar access failed or is not configured; callers must fail closed. */
export class CalendarUnavailableError extends Error {}
/** Booking credentials/calendar are missing for this environment. */
export class CalendarConfigurationError extends CalendarUnavailableError {}

export type BookingConfig =
  | { enabled: true; calendarId: string; busyCalendarIds: string[] }
  | { enabled: false; reason: "disabled" | "unconfigured" };

const env = (name: string) => process.env[name]?.trim() || undefined;

const calendarList = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

/**
 * Preview deployments use only the GOOGLE_PREVIEW_* calendars and never fall
 * back to the production calendar, matching the Discord webhook policy.
 */
export function bookingConfig(): BookingConfig {
  if (env("BOOKING_ENABLED") !== "true")
    return { enabled: false, reason: "disabled" };
  if (
    !env("GOOGLE_OAUTH_CLIENT_ID") ||
    !env("GOOGLE_OAUTH_CLIENT_SECRET") ||
    !env("GOOGLE_CALENDAR_REFRESH_TOKEN")
  )
    return { enabled: false, reason: "unconfigured" };
  const preview = process.env.VERCEL_ENV === "preview";
  const calendarId = preview
    ? env("GOOGLE_PREVIEW_CALENDAR_ID")
    : (env("GOOGLE_CALENDAR_ID") ?? "primary");
  if (!calendarId) return { enabled: false, reason: "unconfigured" };
  const extra = calendarList(
    preview
      ? process.env.GOOGLE_PREVIEW_BUSY_CALENDAR_IDS
      : process.env.GOOGLE_BUSY_CALENDAR_IDS,
  );
  const busyCalendarIds = [...new Set([calendarId, ...extra])];
  // freeBusy accepts more, but a long list signals a misconfiguration.
  if (busyCalendarIds.length > MAX_BUSY_CALENDARS)
    return { enabled: false, reason: "unconfigured" };
  return { enabled: true, calendarId, busyCalendarIds };
}

function requireConfig() {
  const config = bookingConfig();
  if (!config.enabled)
    throw new CalendarConfigurationError(
      config.reason === "disabled"
        ? "Self-scheduling is disabled."
        : "Calendar booking is not configured for this environment.",
    );
  return config;
}

// ---------------------------------------------------------------------------
// Access token (module-memory cache, deduplicated refresh)

let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingRefresh: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const body = new URLSearchParams({
    client_id: env("GOOGLE_OAUTH_CLIENT_ID") ?? "",
    client_secret: env("GOOGLE_OAUTH_CLIENT_SECRET") ?? "",
    refresh_token: env("GOOGLE_CALENDAR_REFRESH_TOKEN") ?? "",
    grant_type: "refresh_token",
  });
  let response: Response;
  try {
    response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new CalendarUnavailableError("Google sign-in could not be reached.");
  }
  let data: {
    access_token?: unknown;
    expires_in?: unknown;
    error?: unknown;
  } = {};
  try {
    data = await response.json();
  } catch {
    // Treated as an invalid response below; the body is never surfaced.
  }
  if (!response.ok) {
    if (data.error === "invalid_grant")
      throw new CalendarConfigurationError(
        "The Google Calendar refresh token was rejected (revoked, expired, or issued while the OAuth app was in Testing). Regenerate it with `pnpm google:auth` and update GOOGLE_CALENDAR_REFRESH_TOKEN.",
      );
    if (data.error === "invalid_client" || data.error === "unauthorized_client")
      throw new CalendarConfigurationError(
        "The Google OAuth client credentials were rejected.",
      );
    throw new CalendarUnavailableError(
      `Google sign-in failed (HTTP ${response.status}).`,
    );
  }
  if (
    typeof data.access_token !== "string" ||
    !data.access_token ||
    typeof data.expires_in !== "number" ||
    !Number.isFinite(data.expires_in)
  )
    throw new CalendarUnavailableError("Google sign-in returned no token.");
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - EXPIRY_MARGIN_MS,
  };
  return cachedToken.value;
}

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now())
    return cachedToken.value;
  pendingRefresh ??= refreshAccessToken().finally(() => {
    pendingRefresh = null;
  });
  return pendingRefresh;
}

/** Authorized Calendar API call; retries once with a fresh token on 401. */
async function calendarFetch(
  path: string,
  init: { method: string; body?: unknown },
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const token = await accessToken();
    let response: Response;
    try {
      response = await fetch(`${CALENDAR_API}${path}`, {
        method: init.method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(init.body === undefined
            ? {}
            : { "Content-Type": "application/json" }),
        },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
    } catch {
      throw new CalendarUnavailableError(
        "Google Calendar could not be reached.",
      );
    }
    if (response.status === 401 && attempt === 0) {
      if (cachedToken?.value === token) cachedToken = null;
      continue;
    }
    return response;
  }
}

const validDate = (value: Date) =>
  value instanceof Date && Number.isFinite(value.getTime());

// ---------------------------------------------------------------------------
// Public API

/**
 * Busy time across the hold calendar and any configured busy calendars.
 * Fails closed: any request, calendar, or parse error throws instead of
 * returning an empty (free) result.
 */
export async function getBusyIntervals(
  timeMin: Date,
  timeMax: Date,
): Promise<BusyInterval[]> {
  const { busyCalendarIds } = requireConfig();
  if (!validDate(timeMin) || !validDate(timeMax) || timeMax <= timeMin)
    throw new RangeError("Invalid free/busy range.");
  const response = await calendarFetch("/freeBusy", {
    method: "POST",
    body: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: "UTC",
      items: busyCalendarIds.map((id) => ({ id })),
    },
  });
  if (!response.ok)
    throw new CalendarUnavailableError(
      `Google Calendar free/busy failed (HTTP ${response.status}).`,
    );
  let data: {
    calendars?: Record<
      string,
      { errors?: unknown[]; busy?: { start?: unknown; end?: unknown }[] }
    >;
  };
  try {
    data = await response.json();
  } catch {
    throw new CalendarUnavailableError("Invalid free/busy response.");
  }
  const busy: BusyInterval[] = [];
  for (const id of busyCalendarIds) {
    const entry = data.calendars?.[id];
    if (!entry || (entry.errors && entry.errors.length > 0))
      throw new CalendarUnavailableError(
        "A configured calendar's availability could not be read.",
      );
    if (!Array.isArray(entry.busy))
      throw new CalendarUnavailableError("Invalid free/busy response.");
    for (const block of entry.busy) {
      const start = new Date(String(block?.start));
      const end = new Date(String(block?.end));
      if (!validDate(start) || !validDate(end) || end < start)
        throw new CalendarUnavailableError("Invalid free/busy response.");
      busy.push({ start, end });
    }
  }
  return busy.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * Inserts a tentative, opaque hold and has Google email the customer an
 * invitation. Elisabeth confirms or reschedules manually in Google Calendar.
 */
export async function createTentativeHold(
  input: TentativeHoldInput,
): Promise<TentativeHold> {
  const { calendarId } = requireConfig();
  if (
    !validDate(input.start) ||
    !validDate(input.end) ||
    input.end <= input.start
  )
    throw new RangeError("Invalid hold time.");
  if (!input.attendeeEmail.trim()) throw new RangeError("Missing attendee.");
  const response = await calendarFetch(
    `/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`,
    {
      method: "POST",
      body: {
        summary: input.summary,
        description: input.description,
        ...(input.location ? { location: input.location } : {}),
        start: {
          dateTime: input.start.toISOString(),
          timeZone: BUSINESS_TIME_ZONE,
        },
        end: {
          dateTime: input.end.toISOString(),
          timeZone: BUSINESS_TIME_ZONE,
        },
        status: "tentative",
        transparency: "opaque",
        attendees: [
          {
            email: input.attendeeEmail.trim(),
            displayName: input.attendeeName,
          },
        ],
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        reminders: { useDefault: true },
        extendedProperties: {
          private: { source: "hairnthere-self-schedule" },
        },
      },
    },
  );
  if (!response.ok)
    throw new CalendarUnavailableError(
      `Google Calendar rejected the hold (HTTP ${response.status}).`,
    );
  let data: { id?: unknown; htmlLink?: unknown };
  try {
    data = await response.json();
  } catch {
    throw new CalendarUnavailableError("Invalid hold response.");
  }
  if (typeof data.id !== "string" || !data.id)
    throw new CalendarUnavailableError("Google Calendar returned no hold ID.");
  return {
    eventId: data.id,
    ...(typeof data.htmlLink === "string" ? { htmlLink: data.htmlLink } : {}),
  };
}

/**
 * Removes a hold (rollback after a post-insert conflict check). Google emails
 * the attendee a cancellation. Already-deleted holds count as success.
 */
export async function deleteHold(eventId: string): Promise<void> {
  const { calendarId } = requireConfig();
  if (!eventId) throw new RangeError("Missing hold ID.");
  const response = await calendarFetch(
    `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
    { method: "DELETE" },
  );
  if (response.ok || response.status === 404 || response.status === 410) return;
  throw new CalendarUnavailableError(
    `Google Calendar could not remove the hold (HTTP ${response.status}).`,
  );
}
