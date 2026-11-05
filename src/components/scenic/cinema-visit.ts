"use client";

import { useSyncExternalStore } from "react";
import {
  cinemaVariants,
  defaultCinemaVariant,
  type CinemaVariant,
} from "@/data/cinema";

let initialized = false;
let current: CinemaVariant = defaultCinemaVariant;
const listeners = new Set<() => void>();

function initializePageLoad() {
  if (initialized) return;
  initialized = true;
  const sample = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
  current = cinemaVariants[Math.floor(sample * cinemaVariants.length)];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  initializePageLoad();
  return () => {
    listeners.delete(listener);
  };
}
const getSnapshot = () => current;
const getServerSnapshot = () => defaultCinemaVariant;

/** Draw once per full page load; client navigation keeps the current selection. */
export function useCinemaVisit() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
