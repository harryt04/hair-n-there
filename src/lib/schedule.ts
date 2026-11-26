import { schedule } from "@/data/schedule";
import { services } from "@/data/services";
import type {
  AppointmentEstimate,
  ComputeSlotsInput,
  DayAvailability,
  EstimateInput,
  ScheduleConfig,
  Weekday,
} from "@/lib/schedule-types";

const minute = 60_000;
const day = 86_400_000;
const serviceById = new Map(services.map((service) => [service.id, service]));

export function estimateAppointment(
  input: EstimateInput,
  config: ScheduleConfig = schedule,
): AppointmentEstimate {
  const countsMinutes =
    (input.haircutCount ?? 0) * config.estimates.haircutMinutes +
    (input.colorCount ?? 0) * config.estimates.colorMinutes;
  let selectionMinutes = 0;
  for (const selection of input.services) {
    const service = serviceById.get(selection.id);
    const duration = service?.duration.match(
      /^\+?(\d+)(?:\s*[–-]\s*(\d+))?\s+min$/,
    );
    if (
      !service ||
      service.pricingKind === "consultation_required" ||
      !duration
    ) {
      return { schedulable: false, reason: "consultation_required" };
    }
    selectionMinutes +=
      Number(duration[2] ?? duration[1]) *
      (service.unit === "row" ? 1 : selection.quantity);
  }
  for (const selection of input.packages) {
    const duration = Object.hasOwn(config.packageMinutes, selection.id)
      ? config.packageMinutes[selection.id]
      : undefined;
    if (duration === undefined) {
      return { schedulable: false, reason: "consultation_required" };
    }
    selectionMinutes += duration * selection.quantity;
  }
  // Counts and selections usually describe the same people; don't double-count them.
  const base = Math.max(countsMinutes, selectionMinutes);
  if (base === 0) return { schedulable: false, reason: "nothing_selected" };
  const minutes = Math.ceil((base + config.setupMinutes) / 15) * 15;
  if (!Number.isFinite(minutes) || minutes > config.maxAppointmentMinutes) {
    return { schedulable: false, reason: "too_long" };
  }
  return { schedulable: true, minutes };
}

const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(timeZone: string): Intl.DateTimeFormat {
  let result = formatters.get(timeZone);
  if (!result) {
    result = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(timeZone, result);
  }
  return result;
}

function wallParts(instant: Date, timeZone: string): Record<string, string> {
  return Object.fromEntries(
    formatter(timeZone)
      .formatToParts(instant)
      .map(({ type, value }) => [type, value]),
  );
}

export function localDateOf(instant: Date, timeZone: string): string {
  const parts = wallParts(instant, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Ambiguous fall-back times use the earlier instant; nonexistent times throw. */
export function zonedWallTimeToUtc(
  date: string,
  time: string,
  timeZone: string,
): Date {
  const target = Date.parse(`${date}T${time}:00Z`);
  if (!Number.isFinite(target))
    throw new RangeError("Invalid wall-clock date/time");
  const candidates: number[] = [];
  // Probe both sides of a transition to discover each applicable UTC offset.
  for (const delta of [-day, 0, day]) {
    const probe = target + delta;
    const parts = wallParts(new Date(probe), timeZone);
    const wall = Date.parse(
      `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`,
    );
    const candidate = target - (wall - probe);
    const check = wallParts(new Date(candidate), timeZone);
    if (
      `${check.year}-${check.month}-${check.day}` === date &&
      `${check.hour}:${check.minute}` === time
    )
      candidates.push(candidate);
  }
  if (!candidates.length)
    throw new RangeError("Nonexistent wall-clock date/time");
  return new Date(Math.min(...candidates));
}

export function addDays(date: string, n: number): string {
  const instant = new Date(`${date}T00:00:00Z`);
  instant.setUTCDate(instant.getUTCDate() + n);
  return instant.toISOString().slice(0, 10);
}

export function weekdayOf(date: string): Weekday {
  return new Date(`${date}T00:00:00Z`).getUTCDay() as Weekday;
}

export function bookingRange(
  now: Date,
  config: ScheduleConfig = schedule,
): {
  firstDate: string;
  lastDate: string;
  timeMin: Date;
  timeMax: Date;
} {
  const firstDate = localDateOf(
    new Date(now.getTime() + config.minNoticeHours * 60 * minute),
    config.timeZone,
  );
  const lastDate = addDays(
    localDateOf(now, config.timeZone),
    config.horizonDays,
  );
  const buffer = config.travelBufferMinutes * minute;
  return {
    firstDate,
    lastDate,
    timeMin: new Date(
      zonedWallTimeToUtc(firstDate, "00:00", config.timeZone).getTime() -
        buffer,
    ),
    timeMax: new Date(
      zonedWallTimeToUtc(
        addDays(lastDate, 1),
        "00:00",
        config.timeZone,
      ).getTime() + buffer,
    ),
  };
}

function wallMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function computeOpenSlots(
  input: ComputeSlotsInput,
  config: ScheduleConfig = schedule,
): DayAvailability[] {
  const range = bookingRange(input.now, config);
  const first =
    input.fromDate > range.firstDate ? input.fromDate : range.firstDate;
  const last = input.toDate < range.lastDate ? input.toDate : range.lastDate;
  const earliest = input.now.getTime() + config.minNoticeHours * 60 * minute;
  const duration = input.durationMinutes * minute;
  const buffer = config.travelBufferMinutes * minute;
  const days: DayAvailability[] = [];
  for (let date = first; date <= last; date = addDays(date, 1)) {
    const slots = new Map<string, { start: string; end: string }>();
    if (
      !config.blackoutDates.includes(date) &&
      duration > 0 &&
      Number.isFinite(duration) &&
      input.durationMinutes <= config.maxAppointmentMinutes &&
      config.slotStepMinutes > 0
    ) {
      for (const window of config.weekly[weekdayOf(date)]) {
        const windowEnd = zonedWallTimeToUtc(
          date,
          window.end,
          config.timeZone,
        ).getTime();
        for (
          let offset = wallMinutes(window.start);
          offset < wallMinutes(window.end);
          offset += config.slotStepMinutes
        ) {
          const time = `${String(Math.floor(offset / 60)).padStart(2, "0")}:${String(offset % 60).padStart(2, "0")}`;
          let start: number;
          try {
            start = zonedWallTimeToUtc(date, time, config.timeZone).getTime();
          } catch (error) {
            if (error instanceof RangeError) continue; // Spring-forward gap.
            throw error;
          }
          const end = start + duration;
          if (start < earliest || end > windowEnd) continue;
          if (
            input.busy.some(
              (busy) =>
                start - buffer < busy.end.getTime() &&
                end + buffer > busy.start.getTime(),
            )
          )
            continue;
          const slot = {
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString(),
          };
          slots.set(slot.start, slot);
        }
      }
    }
    days.push({
      date,
      slots: [...slots.values()].sort((a, b) => a.start.localeCompare(b.start)),
    });
  }
  return days;
}

export function isSlotOpen(
  start: Date,
  input: Omit<ComputeSlotsInput, "fromDate" | "toDate">,
  config: ScheduleConfig = schedule,
): boolean {
  if (!Number.isFinite(start.getTime())) return false;
  const date = localDateOf(start, config.timeZone);
  return computeOpenSlots(
    { ...input, fromDate: date, toDate: date },
    config,
  ).some((day) => day.slots.some((slot) => slot.start === start.toISOString()));
}
