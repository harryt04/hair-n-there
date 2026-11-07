"use client";

import { useSyncExternalStore } from "react";
import {
  cinemaVariants,
  selectCinemaVariant,
  defaultCinemaVariant,
  type CinemaVariant,
} from "@/data/cinema";

let initialized = false;
let current: CinemaVariant = defaultCinemaVariant;
const listeners = new Set<() => void>();
const storageKey = "hairnthere-cinema-visit-v3";
const tabStorageKey = "hairnthere-cinema-tab-v3";
const inactivityTTL = 24 * 60 * 60 * 1000;
let lastRemembered = 0;

function readVisit(): { variant: CinemaVariant; activeAt: number } | undefined {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (
      stored &&
      cinemaVariants.includes(stored.variant) &&
      typeof stored.activeAt === "number" &&
      Number.isFinite(stored.activeAt) &&
      stored.activeAt <= Date.now() &&
      Date.now() - stored.activeAt < inactivityTTL
    )
      return stored;
  } catch {
    // Missing, malformed, or blocked storage starts with winter.
  }
}

function rememberCurrent() {
  lastRemembered = Date.now();
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        variant: current,
        activeAt: lastRemembered,
      }),
    );
    sessionStorage.setItem(tabStorageKey, current);
  } catch {
    // Storage restrictions must never prevent the page from working.
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function resume() {
  if (!readVisit()) {
    current = defaultCinemaVariant;
    notify();
  }
  rememberCurrent();
}

function onPageShow(event: PageTransitionEvent) {
  // Restored pages keep their scene unless the browser preference has expired.
  if (event.persisted) resume();
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") resume();
  else recordDeparture();
}

function recordDeparture() {
  if (Date.now() - lastRemembered < inactivityTTL && readVisit())
    rememberCurrent();
}

function onActivity() {
  // Bound synchronous storage writes during scrolling and pointer movement.
  if (Date.now() - lastRemembered >= 30_000) resume();
}

function initializePageLoad() {
  if (initialized) return;
  initialized = true;
  const visit = readVisit();
  if (visit) {
    let previous = visit.variant;
    try {
      const stored = sessionStorage.getItem(tabStorageKey);
      previous =
        cinemaVariants.find((variant) => variant === stored) ?? previous;
    } catch {
      // The browser-level record remains available if tab storage is blocked.
    }
    const sample = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    current = selectCinemaVariant(sample, previous);
  } else {
    current = defaultCinemaVariant;
  }
  rememberCurrent();
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  initializePageLoad();
  if (listeners.size === 1) {
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pagehide", recordDeparture);
    document.addEventListener("visibilitychange", onVisibilityChange);
    for (const event of [
      "pointerdown",
      "pointermove",
      "keydown",
      "scroll",
    ] as const) {
      window.addEventListener(event, onActivity, { passive: true });
    }
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", recordDeparture);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      for (const event of [
        "pointerdown",
        "pointermove",
        "keydown",
        "scroll",
      ] as const) {
        window.removeEventListener(event, onActivity);
      }
    }
  };
}
const getSnapshot = () => current;
const getServerSnapshot = () => defaultCinemaVariant;

/** Draw once per full page load without repeating; client navigation stays stable. */
export function useCinemaVisit() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
