"use client";

import * as Primitive from "@ui-sdk/react/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

type CalendarProps = Omit<
  React.ComponentProps<typeof Primitive.Calendar>,
  "children"
> & {
  dayLabel?: (date: string) => string;
  hasOpenings?: (date: string) => boolean;
};

function Calendar({
  className,
  dayLabel,
  hasOpenings,
  ...props
}: CalendarProps) {
  const navigation = cn(
    buttonVariants({ variant: "ghost" }),
    "size-(--cell-size) border-0 p-0 aria-disabled:opacity-50",
  );

  return (
    <Primitive.Calendar
      showOutsideDays
      weekdayFormat="short"
      className={cn(
        "flex flex-col gap-2 rounded-none border-0 bg-transparent p-2 [--cell-size:44px] sm:[--cell-size:40px]",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <Primitive.CalendarPrevious className={navigation}>
          <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Primitive.CalendarPrevious>
        <Primitive.CalendarHeading className="text-sm font-medium" />
        <Primitive.CalendarNext className={navigation}>
          <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Primitive.CalendarNext>
      </div>
      <Primitive.CalendarGrid className="w-full table-fixed">
        <Primitive.CalendarWeekdays>
          {(index) => <Primitive.CalendarWeekday index={index} />}
        </Primitive.CalendarWeekdays>
        <Primitive.CalendarWeeks>
          {({ date }) => (
            <Primitive.CalendarDay
              value={date}
              data-hnt-calendar-day={date}
              aria-label={dayLabel?.(date)}
              className={cn(
                "relative h-(--cell-size) w-auto rounded-md data-today:bg-muted data-today:no-underline data-unavailable:opacity-50 data-unavailable:no-underline data-selected:bg-primary data-selected:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                hasOpenings?.(date) &&
                  "after:absolute after:bottom-0.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-[#d4af78]",
              )}
            />
          )}
        </Primitive.CalendarWeeks>
      </Primitive.CalendarGrid>
    </Primitive.Calendar>
  );
}

export { Calendar };
