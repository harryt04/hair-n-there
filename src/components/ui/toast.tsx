"use client";

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  type ToastRegionProps,
  type ToastType,
} from "@ui-sdk/react/toast";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

const icons = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: OctagonXIcon,
  loading: Loader2Icon,
} satisfies Partial<Record<ToastType, typeof InfoIcon>>;

function Toaster(props: Omit<ToastRegionProps, "children">) {
  return (
    <ToastRegion {...props}>
      {({ type, action }) => {
        const Icon = type && type !== "default" ? icons[type] : undefined;

        return (
          <Toast className="flex flex-nowrap items-start gap-3 rounded-lg border-border bg-popover text-sm text-popover-foreground shadow-md">
            {Icon && (
              <Icon
                aria-hidden="true"
                className={
                  type === "loading"
                    ? "size-4 motion-safe:animate-spin"
                    : "size-4"
                }
              />
            )}
            <div className="min-w-0 flex-1">
              <ToastTitle className="font-medium" />
              <ToastDescription className="text-muted-foreground" />
            </div>
            {action && (
              <ToastAction className="rounded-md border border-border px-2 py-1" />
            )}
            <ToastClose
              aria-label="Dismiss notification"
              className="shrink-0 rounded-md"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </ToastClose>
          </Toast>
        );
      }}
    </ToastRegion>
  );
}

export { Toaster };
export { createToaster, toast } from "@ui-sdk/react/toast";
