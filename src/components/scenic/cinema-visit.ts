"use client";

import { useSyncExternalStore } from "react";
import {
  cinemaSessionKey,
  cinemaVariants,
  defaultCinemaVariant,
  isCinemaVariant,
  type CinemaVariant,
} from "@/data/cinema";

let initialized = false;
let current: CinemaVariant = defaultCinemaVariant;
const listeners = new Set<() => void>();

function initializeVisit() {
  if (initialized) return;
  initialized = true;
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem(cinemaSessionKey);
  } catch {
    // A blocked storage API still permits a stable assignment for this page session.
  }
  if (isCinemaVariant(stored)) {
    current = stored;
  } else {
    const sample = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    current = cinemaVariants[Math.floor(sample * cinemaVariants.length)];
    try {
      sessionStorage.setItem(cinemaSessionKey, current);
    } catch {
      // Keep the in-memory choice when storage is unavailable.
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  initializeVisit();
  return () => {
    listeners.delete(listener);
  };
}
const getSnapshot = () => current;
const getServerSnapshot = () => defaultCinemaVariant;

/** Randomize once per tab visit, never during render or on client navigation. */
export function useCinemaVisit() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
