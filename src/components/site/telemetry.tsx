"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportTimeToFirstByte } from "@/lib/analytics";

export { trackEvent } from "@/lib/analytics";

export function Telemetry() {
  useReportWebVitals(reportTimeToFirstByte);
  return null;
}
