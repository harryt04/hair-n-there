import type { CaptureResult } from "posthog-js";

const allowedEvents = new Set([
  "$pageview",
  "$pageleave",
  "$web_vitals",
  "web_vital",
  "instagram_clicked",
  "inquiry_started",
  "inquiry_submitted",
]);

// Keep SDK identity in memory and broad device information, never arbitrary
// super properties, person properties, campaign values, or DOM attribution.
const scalarProperties = new Set([
  "token",
  "distinct_id",
  "$device_id",
  "$session_id",
  "$window_id",
  "$lib",
  "$lib_version",
  "$browser",
  "$browser_version",
  "$os",
  "$os_version",
  "$device_type",
  "$screen_height",
  "$screen_width",
  "$viewport_height",
  "$viewport_width",
  "$host",
  "$is_identified",
  "$process_person_profile",
  "$pageview_id",
  "$prev_pageview_id",
  "$pageview_count",
  "$prev_pageview_duration",
  "$pageleave_reason",
]);
const urlProperties = new Set([
  "$current_url",
  "$initial_current_url",
  "$session_entry_url",
]);
const pathProperties = new Set([
  "$pathname",
  "$session_entry_pathname",
  "$prev_pageview_pathname",
]);
const referrerProperties = new Set([
  "$referrer",
  "$initial_referrer",
  "$session_entry_referrer",
]);
const domainProperties = new Set([
  "$referring_domain",
  "$initial_referring_domain",
  "$session_entry_referring_domain",
]);

function cleanUrl(value: unknown): URL | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function isScalar(value: unknown): value is string | number | boolean {
  return (
    typeof value === "boolean" ||
    (typeof value === "string" && value.length <= 500) ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

export function sanitizeAnalyticsEvent(
  event: CaptureResult,
): CaptureResult | null {
  if (!allowedEvents.has(event.event)) return null;
  const properties: CaptureResult["properties"] = {};
  for (const [key, value] of Object.entries(event.properties)) {
    if (scalarProperties.has(key) && isScalar(value)) {
      properties[key] = value;
    } else if (urlProperties.has(key)) {
      const url = cleanUrl(value);
      if (url) properties[key] = url.toString();
    } else if (pathProperties.has(key) && typeof value === "string") {
      properties[key] = value.split(/[?#]/, 1)[0];
    } else if (referrerProperties.has(key)) {
      const url = cleanUrl(value);
      if (url) properties[key] = url.origin + "/";
    } else if (domainProperties.has(key) && typeof value === "string") {
      const url = cleanUrl(`https://${value}`);
      if (url) properties[key] = url.hostname;
    } else if (
      event.event === "$web_vitals" &&
      /^\$web_vitals_(LCP|INP|CLS|FCP)_value$/.test(key)
    ) {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0)
        properties[key] = value;
    } else if (
      event.event === "$web_vitals" &&
      /^\$web_vitals_(LCP|INP|CLS|FCP)_event$/.test(key) &&
      value &&
      typeof value === "object"
    ) {
      // Raw metric objects may include resource URLs and interaction targets.
      // Keep only the fields needed to interpret the measurement.
      const metric: Record<string, unknown> = {};
      for (const field of [
        "name",
        "value",
        "delta",
        "id",
        "rating",
        "navigationType",
        "timestamp",
        "$session_id",
        "$window_id",
      ]) {
        if (isScalar(value[field])) metric[field] = value[field];
      }
      const url = cleanUrl(value.$current_url);
      if (url) metric.$current_url = url.toString();
      properties[key] = metric;
    } else if (event.event === "web_vital") {
      if (key === "metric_name" && value === "TTFB") properties[key] = value;
      if (
        key === "metric_value" &&
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
      )
        properties[key] = value;
    }
  }
  return {
    uuid: event.uuid,
    event: event.event,
    timestamp: event.timestamp,
    properties,
  };
}
