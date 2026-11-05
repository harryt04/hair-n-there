/** Approved artwork is preserved independently of the page-load assignment policy. */
export const cinemaVariants = [
  "alpine-local",
  "powder-day",
  "night-shift",
] as const;
export type CinemaVariant = (typeof cinemaVariants)[number];

export const defaultCinemaVariant: CinemaVariant = "powder-day";
