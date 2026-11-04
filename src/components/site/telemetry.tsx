"use client";
import { Analytics } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
export function trackEvent(
  event: "instagram_clicked" | "quote_started" | "inquiry_submitted",
) {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") track(event);
}
export function Telemetry() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") return null;
  return (
    <>
      <Analytics
        beforeSend={(event) => {
          const url = new URL(event.url);
          url.search = "";
          url.hash = "";
          return { ...event, url: url.toString() };
        }}
      />
      <SpeedInsights
        beforeSend={(event) => {
          const url = new URL(event.url);
          url.search = "";
          url.hash = "";
          return { ...event, url: url.toString() };
        }}
      />
    </>
  );
}
