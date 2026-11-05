/** Approved artwork is preserved independently of the visit-assignment policy. */
export const cinemaVariants = [
  "alpine-local",
  "powder-day",
  "night-shift",
] as const;
export type CinemaVariant = (typeof cinemaVariants)[number];

export const defaultCinemaVariant: CinemaVariant = "powder-day";
export const cinemaSessionKey = "hairnthere-cinema-v1";

export function isCinemaVariant(value: unknown): value is CinemaVariant {
  return cinemaVariants.some((variant) => variant === value);
}
