"use client";

import * as React from "react";
import * as Primitive from "@ui-sdk/react/select";
import { cn } from "cn";
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react";

const Select = Primitive.Select;

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.SelectGroup>) {
  return (
    <Primitive.SelectGroup
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.SelectValue>) {
  return (
    <Primitive.SelectValue
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: Omit<React.ComponentProps<typeof Primitive.SelectTrigger>, "children"> & {
  children?: React.ReactNode;
  size?: "sm" | "default";
}) {
  return (
    <Primitive.SelectTrigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none size-4 text-muted-foreground"
      />
    </Primitive.SelectTrigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: Omit<React.ComponentProps<typeof Primitive.SelectContent>, "children"> & {
  children?: React.ReactNode;
}) {
  const [list, setList] = React.useState<HTMLDivElement | null>(null);
  const [items, setItems] = React.useState<HTMLDivElement | null>(null);
  return (
    <Primitive.SelectContent
      container={typeof document === "undefined" ? undefined : document.body}
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      alignItemWithTrigger={alignItemWithTrigger}
      data-align-trigger={alignItemWithTrigger}
      className={cn(
        "relative isolate z-50 flex max-h-(--available-height) flex-col w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className,
      )}
      {...props}
    >
      <SelectScrollContext.Provider value={{ list, items }}>
        <SelectScrollUpButton />
        <Primitive.SelectList
          ref={setList}
          className="min-h-0 overflow-y-auto overscroll-contain scroll-py-6"
        >
          <div ref={setItems} role="presentation">
            {children}
          </div>
        </Primitive.SelectList>
        <SelectScrollDownButton />
      </SelectScrollContext.Provider>
    </Primitive.SelectContent>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.SelectGroupLabel>) {
  return (
    <Primitive.SelectGroupLabel
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectItem<T = string>({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Primitive.SelectItem<T>>, "children"> & {
  children?: React.ReactNode;
}) {
  return (
    <Primitive.SelectItem
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <Primitive.SelectItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </Primitive.SelectItemText>
      <Primitive.SelectItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon className="pointer-events-none" />
      </Primitive.SelectItemIndicator>
    </Primitive.SelectItem>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.SelectSeparator>) {
  return (
    <Primitive.SelectSeparator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

const SelectScrollContext = React.createContext<{
  list: HTMLDivElement | null;
  items: HTMLDivElement | null;
} | null>(null);

type ScrollArrowProps = Omit<React.ComponentProps<"div">, "children">;

function SelectScrollArrow({
  direction,
  className,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  ...props
}: ScrollArrowProps & { direction: -1 | 1 }) {
  const { list, items } = React.useContext(SelectScrollContext) ?? {};
  const [visible, setVisible] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const stop = () => window.clearInterval(timer.current);

  React.useEffect(() => {
    if (!list || !items) return;
    const update = () => {
      const canScroll =
        direction === -1
          ? list.scrollTop > 1
          : list.scrollTop + list.clientHeight < list.scrollHeight - 1;
      setVisible(canScroll);
      if (!canScroll) window.clearInterval(timer.current);
    };
    const observer = new ResizeObserver(update);
    observer.observe(list);
    observer.observe(items);
    list.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", update);
      window.clearInterval(timer.current);
    };
  }, [direction, items, list]);

  function start() {
    if (!list) return;
    stop();
    const move = () =>
      list.scrollBy({ top: direction * 8, behavior: "instant" });
    move();
    timer.current = window.setInterval(move, 16);
  }

  if (!visible) return null;
  const Icon = direction === -1 ? ChevronUpIcon : ChevronDownIcon;

  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn(
        "absolute inset-x-0 z-10 flex w-full touch-none cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        direction === -1 ? "top-0" : "bottom-0",
        className,
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (!event.defaultPrevented && event.pointerType !== "touch") start();
      }}
      onPointerLeave={(event) => {
        stop();
        onPointerLeave?.(event);
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        start();
      }}
      onPointerUp={(event) => {
        if (
          event.pointerType === "touch" ||
          !event.currentTarget.matches(":hover")
        )
          stop();
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        stop();
        onPointerCancel?.(event);
      }}
    >
      <Icon />
    </div>
  );
}

function SelectScrollUpButton(props: ScrollArrowProps) {
  return (
    <SelectScrollArrow
      data-slot="select-scroll-up-button"
      direction={-1}
      {...props}
    />
  );
}

function SelectScrollDownButton(props: ScrollArrowProps) {
  return (
    <SelectScrollArrow
      data-slot="select-scroll-down-button"
      direction={1}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
