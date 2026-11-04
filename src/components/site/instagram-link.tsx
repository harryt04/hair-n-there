"use client";
import type { ComponentProps } from "react";
import { trackEvent } from "@/components/site/telemetry";
export function InstagramLink({ children, ...props }: ComponentProps<"a">) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("instagram_clicked")}
    >
      {children}
    </a>
  );
}
