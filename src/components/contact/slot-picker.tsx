"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  AvailabilityResponse,
  EstimateInput,
  Slot,
} from "@/lib/schedule-types";

const key = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => new Date(`${s}T12:00:00`);
const add = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return key(d);
};
export function slotTime(s: string, timeZone = "America/Denver") {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(s));
}
export function SlotSummary({
  slot,
  timeZone,
  onChange,
}: {
  slot: Slot | null;
  timeZone: string;
  onChange?: () => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={
        slot
          ? "my-4 grid gap-2 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm"
          : ""
      }
    >
      {slot && (
        <>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-primary">
              Requested time · tentative hold
            </span>
            {onChange && (
              <button
                type="button"
                onClick={onChange}
                className="min-h-11 text-primary underline underline-offset-4"
              >
                Change
              </button>
            )}
          </div>
          <b>
            {new Intl.DateTimeFormat("en-US", {
              timeZone,
              weekday: "long",
              month: "long",
              day: "numeric",
            }).format(new Date(slot.start))}{" "}
            · {slotTime(slot.start, timeZone)} – {slotTime(slot.end, timeZone)}
          </b>
          <p className="text-muted-foreground">
            Elisabeth will confirm or suggest another time. You’ll get a
            calendar invitation by email.
          </p>
        </>
      )}
    </div>
  );
}
export function SlotPicker(
  props: React.ComponentProps<typeof MountedSlotPicker>,
) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return mounted ? (
    <MountedSlotPicker {...props} />
  ) : (
    <div
      role="status"
      className="h-64 rounded-lg bg-muted motion-safe:animate-pulse"
    >
      <span className="sr-only">Loading open times…</span>
    </div>
  );
}
function MountedSlotPicker({
  selection,
  active,
  slot,
  onSlot,
  fallback,
  forcedFallback,
  revision,
  errorId,
}: {
  selection: EstimateInput;
  active: boolean;
  slot: Slot | null;
  onSlot: (slot: Slot | null, zone?: string) => void;
  fallback: ReactNode;
  forcedFallback: boolean;
  revision: number;
  errorId?: string;
}) {
  const signature = JSON.stringify({
    haircutCount: selection.haircutCount,
    colorCount: selection.colorCount,
    services: selection.services,
    packages: selection.packages,
  });
  const [today] = useState(() =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Denver",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()),
  );
  const [week, setWeek] = useState(today);
  const [date, setDate] = useState("");
  const [month, setMonth] = useState(today.slice(0, 7));
  const [cache, setCache] = useState<Record<string, AvailabilityResponse>>({});
  const cacheRef = useRef<Record<string, AvailabilityResponse>>({});
  const inFlight = useRef(new Map<string, Promise<AvailabilityResponse>>());
  const [failures, setFailures] = useState<
    Record<string, AvailabilityResponse>
  >({});
  const ready =
    [selection.haircutCount, selection.colorCount].every(
      (count) => typeof count === "number" && Number.isFinite(count),
    ) &&
    [...selection.services, ...selection.packages].every((item) =>
      Number.isFinite(item.quantity),
    );
  const heading = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [flex, setFlex] = useState(false);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState(false);
  const [visitor, setVisitor] = useState("");
  const times = useRef<HTMLHeadingElement>(null);
  const initialized = useRef("");
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setPhone(mq.matches);
    const frame = requestAnimationFrame(() => {
      update();
      setVisitor(Intl.DateTimeFormat().resolvedOptions().timeZone);
    });
    mq.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      mq.removeEventListener("change", update);
    };
  }, []);
  const months = [
    ...new Set([week.slice(0, 7), add(week, 13).slice(0, 7), month]),
  ]
    .sort()
    .join(",");
  useEffect(() => {
    if (!active || !ready || forcedFallback || flex) return;
    let current = true;
    const timer = setTimeout(() => {
      setFailures({});
      for (const m of months.split(",")) {
        const id = `${signature}:${revision}:${m}`;
        if (cacheRef.current[id]) continue;
        let request = inFlight.current.get(id);
        if (!request) {
          request = fetch("/api/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...JSON.parse(signature), month: m }),
          }).then(async (response) => {
            if (!response.ok) throw Error();
            const result: AvailabilityResponse = await response.json();
            cacheRef.current[id] = result;
            return result;
          });
          inFlight.current.set(id, request);
          // Requests already sent finish even when the visible strip changes.
          void request
            .finally(() => inFlight.current.delete(id))
            .catch(() => {});
        }
        void request
          .then((result) => {
            if (current) setCache((c) => ({ ...c, [id]: result }));
          })
          .catch(() => {
            if (current)
              setFailures((f) => ({
                ...f,
                [id]: { enabled: false, reason: "unavailable" },
              }));
          });
      }
      setCache({ ...cacheRef.current });
    }, 300);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [active, ready, forcedFallback, flex, signature, revision, months]);
  const responses = months
    .split(",")
    .map(
      (m) =>
        cache[`${signature}:${revision}:${m}`] ??
        failures[`${signature}:${revision}:${m}`],
    );
  const info = responses.find((r) => r?.enabled === true);
  const failure = responses.find((r) => r?.enabled === false);
  const days = responses.flatMap((r) => (r?.enabled ? r.days : []));
  const loading = responses.some((r) => !r);
  useEffect(() => {
    if (!info?.enabled || initialized.current === `${signature}:${revision}`)
      return;
    if (loading || failure || !active || !ready) return;
    const first = days
      .filter((d) => d.date >= info.firstDate && d.date <= info.lastDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .find((d) => d.slots.length)?.date;
    if (!first) {
      const latest = months.split(",").at(-1)!;
      if (latest < info.lastDate.slice(0, 7)) {
        const next = parse(`${latest}-01`);
        next.setMonth(next.getMonth() + 1);
        const frame = requestAnimationFrame(() =>
          setMonth(key(next).slice(0, 7)),
        );
        return () => cancelAnimationFrame(frame);
      }
      initialized.current = `${signature}:${revision}`;
      return;
    }
    // Keep the visitor's day after a conflict, but initialize each new selection.
    if (revision === 0 || !date) {
      const frame = requestAnimationFrame(() => {
        initialized.current = `${signature}:${revision}`;
        setDate(first);
        setWeek(first);
        setMonth(first.slice(0, 7));
      });
      return () => cancelAnimationFrame(frame);
    }
    initialized.current = `${signature}:${revision}`;
  }, [
    info,
    signature,
    revision,
    date,
    loading,
    failure,
    active,
    ready,
    days,
    months,
  ]);
  const zone = info?.enabled ? info.timeZone : "America/Denver";
  const slots = days.find((d) => d.date === date)?.slots || [];
  function choose(d: string, calendar = false) {
    setDate(d);
    onSlot(null);
    if (calendar) {
      setWeek(d);
      setOpen(false);
    }
    requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 639px)").matches)
        times.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  const calendar = (
    <>
      <Calendar
        mode="single"
        autoFocus={!phone}
        month={parse(`${month}-01`)}
        onMonthChange={(d) => setMonth(key(d).slice(0, 7))}
        selected={date ? parse(date) : undefined}
        onSelect={(d) => {
          if (d) choose(key(d), true);
        }}
        startMonth={info?.enabled ? parse(info.firstDate) : undefined}
        endMonth={info?.enabled ? parse(info.lastDate) : undefined}
        disabled={(d) =>
          !days.some((day) => day.date === key(d) && day.slots.length > 0)
        }
        modifiers={{
          open: (d) =>
            days.some((day) => day.date === key(d) && day.slots.length > 0),
        }}
        modifiersClassNames={{
          open: "after:absolute after:bottom-0.5 after:left-1/2 after:size-1 after:rounded-full after:bg-[#d4af78]",
        }}
        labels={{
          labelDayButton: (d) =>
            `${d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}, ${days.find((day) => day.date === key(d))?.slots.length || "no"} times available`,
        }}
        className="w-full [--cell-size:44px] sm:[--cell-size:40px]"
      />
      <p className="text-xs text-muted-foreground">
        <span className="text-[#d4af78]">●</span> Times open · Faded = full or
        unavailable
      </p>
    </>
  );
  const trigger = (
    <Button
      type="button"
      variant="outline"
      ref={triggerRef}
      className="size-11"
      aria-label="Pick a date from the calendar"
    >
      <CalendarDays />
    </Button>
  );
  const reason = failure && !failure.enabled ? failure.reason : "";
  if (forcedFallback || flex || (active && ready && failure))
    return (
      <div aria-live="polite">
        {(reason === "consultation_required" || reason === "too_long") && (
          <p className="mb-4 rounded-lg bg-muted p-4 text-sm">
            This visit needs a quick chat first. Share your preferred timing and
            I’ll follow up.
          </p>
        )}
        {reason === "unavailable" && (
          <p className="mb-4 rounded-lg bg-muted p-4 text-sm">
            Live times couldn’t load right now. Share your preferred timing and
            I’ll follow up.
          </p>
        )}
        {fallback}
        {flex && !forcedFallback && (
          <button
            type="button"
            onClick={() => setFlex(false)}
            className="min-h-11 text-sm text-primary underline"
          >
            Back to open times
          </button>
        )}
      </div>
    );
  return (
    <fieldset className="min-w-0" aria-describedby={errorId}>
      <legend className="sr-only">Choose a time</legend>
      <p className="mb-4 text-sm text-muted-foreground">
        {info?.enabled ? (
          <>
            Estimated visit:{" "}
            <b className="text-foreground">
              about{" "}
              {Math.floor(info.durationMinutes / 60)
                ? `${Math.floor(info.durationMinutes / 60)} hr `
                : ""}
              {info.durationMinutes % 60
                ? `${info.durationMinutes % 60} min`
                : ""}
            </b>
            . Timing may change with your personal quote.
          </>
        ) : (
          "Estimating your visit…"
        )}
      </p>
      <p className="mb-3 text-xs text-muted-foreground">
        Times are in Utah (Mountain Time)
        {visitor && visitor !== "America/Denver"
          ? ` · Your browser is in ${visitor.replaceAll("_", " ")}.`
          : ""}
      </p>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display">
          {parse(
            date >= week && date <= add(week, 13) ? date : week,
          ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex">
          <Button
            type="button"
            variant="ghost"
            className="size-11"
            aria-label="Earlier days"
            disabled={!info?.enabled || week <= info.firstDate}
            onClick={() =>
              setWeek(
                info?.enabled && add(week, -7) < info.firstDate
                  ? info.firstDate
                  : add(week, -7),
              )
            }
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="size-11"
            aria-label="Later days"
            disabled={!info?.enabled || add(week, 7) > info.lastDate}
            onClick={() => setWeek(add(week, 7))}
          >
            <ChevronRight />
          </Button>
          {phone ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={trigger} />
              <SheetContent
                side="bottom"
                initialFocus={heading}
                finalFocus={triggerRef}
                className="rounded-t-2xl p-2 pb-[max(1rem,env(safe-area-inset-bottom))] motion-reduce:transition-none"
              >
                <SheetTitle ref={heading} tabIndex={-1} className="px-2">
                  Choose a date
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Choose a day with open times.
                </SheetDescription>
                {calendar}
              </SheetContent>
            </Sheet>
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger render={trigger} />
              <PopoverContent
                finalFocus={triggerRef}
                className="w-[320px] motion-reduce:animate-none"
              >
                <PopoverTitle>Choose a date</PopoverTitle>
                {calendar}
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      {loading ? (
        <div role="status" className="space-y-3 py-3">
          <span className="sr-only">Loading open times…</span>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="h-[78px] rounded-lg bg-muted motion-safe:animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="h-[52px] rounded-lg bg-muted motion-safe:animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            className="-mx-5 flex snap-x gap-1.5 overflow-x-auto px-5 py-3 sm:mx-0 sm:px-0"
            role="group"
            aria-label="Days"
          >
            {Array.from({ length: 14 }, (_, i) => add(week, i))
              .filter((d) => !info?.enabled || d <= info.lastDate)
              .map((d) => {
                const count =
                  days.find((day) => day.date === d)?.slots.length || 0;
                return (
                  <button
                    type="button"
                    key={d}
                    disabled={!count}
                    aria-pressed={date === d}
                    aria-label={`${parse(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}, ${count ? `${count} times open` : "full, no times available"}`}
                    onClick={() => choose(d)}
                    className="grid min-h-[78px] w-[60px] shrink-0 snap-start gap-0.5 rounded-lg border border-border bg-card py-2 text-center disabled:opacity-45 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                  >
                    <span className="text-[11px] uppercase">
                      {parse(d).toLocaleDateString("en-US", {
                        [parse(d).getDate() === 1 ? "month" : "weekday"]:
                          "short",
                      })}
                    </span>
                    <span className="font-display text-xl">
                      {parse(d).getDate()}
                    </span>
                    <span className="text-[11px]">
                      {count ? `${count} open` : "Full"}
                    </span>
                  </button>
                );
              })}
          </div>
          <h3
            ref={times}
            tabIndex={-1}
            className="my-3 scroll-mt-[calc(var(--site-header-height)+var(--cinema-compact-height)+1rem)] font-display"
          >
            {date
              ? parse(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : "Choose a day"}
          </h3>
          <div
            role="radiogroup"
            aria-label="Open times"
            onKeyDown={(e) => {
              if (
                !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  e.key,
                )
              )
                return;
              e.preventDefault();
              const buttons = Array.from(
                e.currentTarget.querySelectorAll<HTMLButtonElement>(
                  '[role="radio"]',
                ),
              );
              const i = buttons.indexOf(e.target as HTMLButtonElement);
              const next =
                buttons[
                  (i +
                    (["ArrowRight", "ArrowDown"].includes(e.key) ? 1 : -1) +
                    buttons.length) %
                    buttons.length
                ];
              next?.focus();
              next?.click();
            }}
          >
            {["Morning", "Afternoon", "Evening"].map((group) => {
              const list = slots.filter((s) => {
                const h = Number(
                  new Intl.DateTimeFormat("en-US", {
                    timeZone: zone,
                    hour: "numeric",
                    hourCycle: "h23",
                  }).format(new Date(s.start)),
                );
                return (
                  (h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening") ===
                  group
                );
              });
              return (
                list.length > 0 && (
                  <div key={group}>
                    {slots.length > 6 && (
                      <p className="mb-2 mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                        {group}
                      </p>
                    )}
                    <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {list.map((s) => (
                        <button
                          type="button"
                          key={s.start}
                          role="radio"
                          aria-checked={slot?.start === s.start}
                          tabIndex={
                            slot
                              ? slot.start === s.start
                                ? 0
                                : -1
                              : slots[0] === s
                                ? 0
                                : -1
                          }
                          onClick={() => onSlot(s, zone)}
                          className="min-h-[52px] rounded-lg border border-border px-2 py-2 text-sm aria-checked:border-primary aria-checked:bg-primary aria-checked:text-primary-foreground"
                        >
                          {slotTime(s.start, zone)}
                          <small className="block opacity-75">
                            until {slotTime(s.end, zone)}
                          </small>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              );
            })}
          </div>
          {!slots.length && (
            <p role="status" className="rounded-lg bg-muted p-5 text-sm">
              {date
                ? "No times left on this day. Choose another day or describe your timing below."
                : "Pick a day to see open times."}
            </p>
          )}
        </>
      )}
      <SlotSummary
        slot={slot}
        timeZone={zone}
        onChange={() => {
          onSlot(null);
          requestAnimationFrame(() => {
            times.current?.focus({ preventScroll: true });
            times.current?.scrollIntoView({ block: "start" });
          });
        }}
      />
      <button
        type="button"
        onClick={() => {
          setFlex(true);
          onSlot(null);
        }}
        className="my-2 min-h-11 text-left text-sm text-primary underline underline-offset-4"
      >
        None of these work? Describe your timing instead
      </button>
    </fieldset>
  );
}
