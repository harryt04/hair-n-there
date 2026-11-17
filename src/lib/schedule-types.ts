// Shared contract for self-scheduled tentative holds. Times on the wire are UTC
// ISO strings ("2026-11-20T16:00:00.000Z"); calendar dates are local
// America/Denver dates ("2026-11-20"). Browser-supplied slots are untrusted:
// the server recomputes duration and openness before writing a hold.

/** "HH:MM" 24-hour local wall-clock time. */
export type WallTime = string;
export type TimeWindow = { start: WallTime; end: WallTime };
/** 0 = Sunday … 6 = Saturday, matching Date#getDay in the business time zone. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ScheduleConfig = {
  timeZone: string;
  weekly: Record<Weekday, TimeWindow[]>;
  /** Start-time granularity offered to customers. */
  slotStepMinutes: number;
  /** Private travel/turnover buffer kept clear before and after every busy block. */
  travelBufferMinutes: number;
  /** Added once per household appointment for setup and cleanup. */
  setupMinutes: number;
  minNoticeHours: number;
  horizonDays: number;
  /** Longer estimates fall back to a manual inquiry. */
  maxAppointmentMinutes: number;
  /** Per-person estimates for the form's haircut/color counts. */
  estimates: { haircutMinutes: number; colorMinutes: number };
  /** Package ID → estimated minutes for the whole package. */
  packageMinutes: Record<string, number>;
  /** Local dates ("YYYY-MM-DD") with no availability. */
  blackoutDates: string[];
};

export type EstimateInput = {
  haircutCount?: number;
  colorCount?: number;
  services: { id: string; quantity: number }[];
  packages: { id: string; quantity: number }[];
};

/**
 * Minutes for the appointment itself, or null when the selection cannot be
 * self-scheduled (consultation-required service, nothing selected, or over
 * maxAppointmentMinutes).
 */
export type AppointmentEstimate =
  | { schedulable: true; minutes: number }
  | {
      schedulable: false;
      reason: "nothing_selected" | "consultation_required" | "too_long";
    };

export type BusyInterval = { start: Date; end: Date };

export type Slot = { start: string; end: string };
export type DayAvailability = { date: string; slots: Slot[] };

export type ComputeSlotsInput = {
  now: Date;
  durationMinutes: number;
  busy: BusyInterval[];
  /** Inclusive local dates; clipped to [today + notice, today + horizon]. */
  fromDate: string;
  toDate: string;
};

/** POST /api/availability request body. */
export type AvailabilityRequest = EstimateInput & {
  /** Local month "YYYY-MM" to return. */
  month: string;
};

/** POST /api/availability response body. */
export type AvailabilityResponse =
  | {
      enabled: true;
      timeZone: string;
      durationMinutes: number;
      /** Bookable local date range for the date picker. */
      firstDate: string;
      lastDate: string;
      /** Every date of the requested month inside the range, including empty days. */
      days: DayAvailability[];
    }
  | {
      enabled: false;
      reason:
        | "disabled"
        | "unavailable"
        | "nothing_selected"
        | "consultation_required"
        | "too_long";
    };

export type TentativeHoldInput = {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  location?: string;
  attendeeEmail: string;
  attendeeName: string;
};

export type TentativeHold = { eventId: string; htmlLink?: string };
