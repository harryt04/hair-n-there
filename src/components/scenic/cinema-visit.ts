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
const storageKey = "hairnthere-cinema-last-v2";

function rememberCurrent() {
  try {
    sessionStorage.setItem(storageKey, current);
  } catch {
    // Storage restrictions must never prevent the page from working.
  }
}

function onPageShow(event: PageTransitionEvent) {
  // A restored page is showing its original scene, not the most recent full load's.
  if (event.persisted) rememberCurrent();
}

function initializePageLoad() {
  if (initialized) return;
  initialized = true;
  let previous: CinemaVariant | undefined;
  try {
    const stored = sessionStorage.getItem(storageKey);
    previous = cinemaVariants.find((variant) => variant === stored);
  } catch {
    // Without storage, fall back to an independent draw.
  }
  const sample = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
  current = selectCinemaVariant(sample, previous);
  rememberCurrent();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  initializePageLoad();
  window.addEventListener("pageshow", onPageShow);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("pageshow", onPageShow);
  };
}
const getSnapshot = () => current;
const getServerSnapshot = () => defaultCinemaVariant;

/** Draw once per full page load without repeating; client navigation stays stable. */
export function useCinemaVisit() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
