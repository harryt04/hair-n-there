/** Approved artwork is preserved independently of the page-load assignment policy. */
export const cinemaVariants = [
  "alpine-local",
  "powder-day",
  "night-shift",
] as const;
export type CinemaVariant = (typeof cinemaVariants)[number];

export const defaultCinemaVariant: CinemaVariant = "powder-day";

/** One uniform sample in [0, 1): winter 75%, each alternative 12.5%. */
export function selectCinemaVariant(sample: number): CinemaVariant {
  if (sample < 0.75) return "powder-day";
  if (sample < 0.875) return "alpine-local";
  return "night-shift";
}
