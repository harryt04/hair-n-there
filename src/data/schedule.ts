import type { ScheduleConfig } from "@/lib/schedule-types";

// Elisabeth's regular working windows, supplied by Harry on 2026-11-16.
// Anything already on her Google Calendar inside these windows blocks the time.
// Changing hours requires a code change and deployment for now.
const fullDay = [{ start: "09:00", end: "21:00" }] as const;

export const schedule = {
  timeZone: "America/Denver",
  weekly: {
    0: [{ start: "09:00", end: "15:00" }], // Sunday
    1: [...fullDay], // Monday
    2: [...fullDay], // Tuesday
    3: [...fullDay], // Wednesday
    4: [{ start: "09:00", end: "14:00" }], // Thursday
    5: [{ start: "09:00", end: "14:00" }], // Friday
    6: [...fullDay], // Saturday
  },
  slotStepMinutes: 30,
  travelBufferMinutes: 30,
  setupMinutes: 15,
  minNoticeHours: 24,
  horizonDays: 60,
  maxAppointmentMinutes: 480,
  // Estimates for the contact form's people counts, where the exact service is unknown.
  estimates: { haircutMinutes: 45, colorMinutes: 150 },
  // Estimates from the included services' upper durations; Elisabeth may adjust.
  packageMinutes: {
    "neighborhood-refresh": 90,
    "color-cut-combo": 180,
    "family-trim": 90,
    "mommy-me": 90,
    "little-crew": 90,
  },
  blackoutDates: [],
} satisfies ScheduleConfig;
