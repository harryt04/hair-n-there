"use client";

import * as Primitive from "@ui-sdk/react/accordion";
import { cn } from "cn";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

function navigateHeaders(event: React.KeyboardEvent<HTMLDivElement>) {
  const { currentTarget, key, target } = event;
  if (
    !(target instanceof HTMLElement) ||
    !target.matches("[data-hnt-accordion-trigger]") ||
    target.closest("[data-hnt-accordion]") !== currentTarget ||
    !["ArrowUp", "ArrowDown", "Home", "End"].includes(key)
  )
    return;

  const headers = Array.from(
    currentTarget.querySelectorAll<HTMLElement>("[data-hnt-accordion-trigger]"),
  ).filter(
    (header) => header.closest("[data-hnt-accordion]") === currentTarget,
  );
  const index = headers.indexOf(target);
  const next = {
    Home: 0,
    End: headers.length - 1,
    ArrowUp: (index - 1 + headers.length) % headers.length,
    ArrowDown: (index + 1) % headers.length,
  }[key];
  if (next === undefined) return;
  event.preventDefault();
  headers[next]?.focus();
}

function Accordion({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof Primitive.Accordion>) {
  return (
    <Primitive.Accordion
      data-hnt-accordion=""
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) navigateHeaders(event);
      }}
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.AccordionItem>) {
  return (
    <Primitive.AccordionItem
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Primitive.AccordionTrigger>, "children"> & {
  children?: React.ReactNode;
}) {
  return (
    <Primitive.AccordionHeader className="flex">
      <Primitive.AccordionTrigger
        data-hnt-accordion-trigger=""
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </Primitive.AccordionTrigger>
    </Primitive.AccordionHeader>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Primitive.AccordionPanel>, "children"> & {
  children?: React.ReactNode;
}) {
  return (
    <Primitive.AccordionPanel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </Primitive.AccordionPanel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
