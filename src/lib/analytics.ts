import posthog from "posthog-js";
import { sanitizeAnalyticsEvent } from "@/lib/analytics-policy";

let initialized = false;

export function initializeAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (
    initialized ||
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ||
    !key
  )
    return;

  try {
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      persistence: "memory",
      person_profiles: "never",
      autocapture: false,
      capture_pageview: "history_change",
      capture_pageleave: true,
      capture_exceptions: false,
      capture_dead_clicks: false,
      rageclick: false,
      disable_session_recording: true,
      disable_surveys: true,
      disable_conversations: true,
      disable_product_tours: true,
      advanced_disable_flags: true,
      save_campaign_params: false,
      disable_capture_url_hashes: true,
      respect_dnt: true,
      debug: false,
      capture_performance: {
        web_vitals: true,
        web_vitals_attribution: false,
        network_timing: false,
      },
      before_send: sanitizeAnalyticsEvent,
    });
    initialized = true;
  } catch {
    // Analytics is optional and must never interrupt navigation or inquiries.
  }
}

export function trackEvent(
  event: "instagram_clicked" | "inquiry_started" | "inquiry_submitted",
) {
  if (!initialized) return;
  try {
    posthog.capture(event);
  } catch {
    // A confirmed inquiry stays successful even if analytics fails.
  }
}

export function reportTimeToFirstByte(metric: { name: string; value: number }) {
  if (!initialized || metric.name !== "TTFB") return;
  try {
    posthog.capture("web_vital", {
      metric_name: "TTFB",
      metric_value: metric.value,
    });
  } catch {
    // Performance reporting must not affect the page.
  }
}
