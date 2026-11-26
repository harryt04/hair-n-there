"use client";

import {
  Toggle,
  ToggleGroup as ToggleGroupPrimitive,
} from "@ui-sdk/react/toggle";
import { cn } from "cn";

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive>) {
  return <ToggleGroupPrimitive className={cn("ps-0", className)} {...props} />;
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof Toggle>) {
  return <Toggle className={cn("ms-0", className)} {...props} />;
}

export { ToggleGroup, ToggleGroupItem };
